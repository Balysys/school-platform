import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware: Verify JWT token
const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(403).json({ message: "Token invalide" });
  }
};

// GET all notes with relations
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        eleve: true,
        matiere: true,
        periode: true,
        enseignant: { select: { nom: true } }
      },
      orderBy: { periodeId: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// GET notes by student
router.get('/eleve/:eleveId', verifyToken, async (req: any, res: Response) => {
  try {
    const eleveId = parseInt(req.params.eleveId);
    
    // Check permission: PARENT can only see their child's notes
    if (req.user.role === 'PARENT') {
      const eleve = await prisma.eleve.findUnique({
        where: { id: eleveId }
      });
      if (eleve?.parentId !== req.user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
    }

    const notes = await prisma.note.findMany({
      where: { eleveId },
      include: {
        eleve: true,
        matiere: true,
        periode: true,
        enseignant: { select: { nom: true } }
      },
      orderBy: { periodeId: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// GET average by student and period
router.get('/eleve/:eleveId/moyennes', verifyToken, async (req: any, res: Response) => {
  try {
    const eleveId = parseInt(req.params.eleveId);
    
    const notes = await prisma.note.findMany({
      where: { eleveId },
      include: { matiere: true, periode: true }
    });

    // Group by period and calculate averages
    const moyennes: any = {};
    for (const note of notes) {
      const key = `${note.periodeId}`;
      if (!moyennes[key]) {
        moyennes[key] = {
          periode: note.periode,
          matieres: {},
          general: 0
        };
      }
      
      const matKey = note.matiereId;
      if (!moyennes[key].matieres[matKey]) {
        moyennes[key].matieres[matKey] = { matiere: note.matiere, notes: [] };
      }
      moyennes[key].matieres[matKey].notes.push(note.valeur);
    }

    // Calculate averages
    const result = Object.values(moyennes).map((m: any) => {
      let totalAvg = 0;
      let totalCoeff = 0;
      
      Object.values(m.matieres).forEach((mat: any) => {
        const avg = mat.notes.reduce((a: number, b: number) => a + b, 0) / mat.notes.length;
        mat.moyenne = Math.round(avg * 100) / 100;
        totalAvg += avg * mat.matiere.coeff;
        totalCoeff += mat.matiere.coeff;
      });
      
      m.general = totalCoeff > 0 ? Math.round((totalAvg / totalCoeff) * 100) / 100 : 0;
      delete m.matieres; // Clean up
      return m;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// POST create new note (ENSEIGNANT only)
router.post('/', verifyToken, async (req: any, res: Response) => {
  try {
    if (req.user.role !== 'ENSEIGNANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Seuls les enseignants peuvent créer des notes" });
    }

    const { eleveId, matiereId, periodeId, valeur } = req.body;

    if (!eleveId || !matiereId || !periodeId || valeur === undefined) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    if (valeur < 0 || valeur > 20) {
      return res.status(400).json({ message: "La note doit être entre 0 et 20" });
    }

    const note = await prisma.note.create({
      data: {
        eleveId: parseInt(eleveId),
        matiereId: parseInt(matiereId),
        periodeId: parseInt(periodeId),
        enseignantId: req.user.id,
        valeur
      },
      include: {
        eleve: true,
        matiere: true,
        periode: true,
        enseignant: { select: { nom: true } }
      }
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// PUT update note (ENSEIGNANT or ADMIN only)
router.put('/:id', verifyToken, async (req: any, res: Response) => {
  try {
    if (req.user.role !== 'ENSEIGNANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { id } = req.params;
    const { valeur } = req.body;

    if (valeur === undefined) {
      return res.status(400).json({ message: "Valeur manquante" });
    }

    if (valeur < 0 || valeur > 20) {
      return res.status(400).json({ message: "La note doit être entre 0 et 20" });
    }

    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: { valeur },
      include: {
        eleve: true,
        matiere: true,
        periode: true,
        enseignant: { select: { nom: true } }
      }
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// DELETE note (ENSEIGNANT or ADMIN only)
router.delete('/:id', verifyToken, async (req: any, res: Response) => {
  try {
    if (req.user.role !== 'ENSEIGNANT' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const { id } = req.params;
    await prisma.note.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Note supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;

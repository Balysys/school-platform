import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(403).json({ message: "Token invalide" });
  }
};

router.post("/", verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const { nom, email, mot_de_passe, role } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const utilisateurExiste = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExiste) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        mot_de_passe: hashedPassword,
        role: role || "PARENT"
      },
      select: { id: true, nom: true, email: true, role: true, createdAt: true }
    });

    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.get("/", verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const utilisateurs = await prisma.utilisateur.findMany({
      select: { id: true, nom: true, email: true, role: true, createdAt: true }
    });
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.get("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "ADMIN" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, nom: true, email: true, role: true, createdAt: true, updatedAt: true }
    });
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.put("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "ADMIN" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const { nom, email, role } = req.body;
    const updateData: any = { nom, email };
    if (req.user.role === "ADMIN") {
      updateData.role = role;
    }
    const utilisateur = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, nom: true, email: true, role: true, createdAt: true, updatedAt: true }
    });
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.delete("/:id", verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const { id } = req.params;
    await prisma.utilisateur.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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

router.get("/", verifyToken, async (req: any, res: any) => {
  try {
    const classes = await prisma.classe.findMany({
      include: { eleves: true }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.get("/:id", verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const classe = await prisma.classe.findUnique({
      where: { id: parseInt(id) },
      include: { eleves: true }
    });
    if (!classe) {
      return res.status(404).json({ message: "Classe non trouvée" });
    }
    res.json(classe);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.post("/", verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const { nom, niveau } = req.body;
    const classe = await prisma.classe.create({
      data: { nom, niveau }
    });
    res.status(201).json(classe);
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

router.put("/:id", verifyToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const { id } = req.params;
    const { nom, niveau } = req.body;
    const classe = await prisma.classe.update({
      where: { id: parseInt(id) },
      data: { nom, niveau }
    });
    res.json(classe);
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
    await prisma.classe.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur" });
  }
});

export default router;

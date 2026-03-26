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

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

// Generate JWT token
const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;

    const utilisateurExiste = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExiste) {
      return res.status(400).json({ message: "Utilisateur déjà inscrit" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        mot_de_passe: hashedPassword,
        role: role || "PARENT"
      }
    });

    const token = generateToken({ id: utilisateur.id, role: utilisateur.role });

    res.status(201).json({
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(400).json({ message: "Email incorrect" });
    }

    const match = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!match) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken({ id: utilisateur.id, role: utilisateur.role });

    res.json({
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});

export default router;

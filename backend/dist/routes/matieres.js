"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Non autorisé" });
    try {
        req.user = jsonwebtoken_1.default.verify(token, SECRET);
        next();
    }
    catch {
        return res.status(403).json({ message: "Token invalide" });
    }
};
router.get("/", verifyToken, async (req, res) => {
    try {
        const matieres = await prisma.matiere.findMany();
        res.json(matieres);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const matiere = await prisma.matiere.findUnique({
            where: { id: parseInt(id) }
        });
        if (!matiere) {
            return res.status(404).json({ message: "Matière non trouvée" });
        }
        res.json(matiere);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.post("/", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Accès interdit" });
        }
        const { nom, coeff } = req.body;
        const matiere = await prisma.matiere.create({
            data: { nom, coeff: coeff || 1 }
        });
        res.status(201).json(matiere);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.put("/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Accès interdit" });
        }
        const { id } = req.params;
        const { nom, coeff } = req.body;
        const matiere = await prisma.matiere.update({
            where: { id: parseInt(id) },
            data: { nom, coeff }
        });
        res.json(matiere);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Accès interdit" });
        }
        const { id } = req.params;
        await prisma.matiere.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Matière supprimée avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
exports.default = router;

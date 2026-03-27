"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
router.post("/", verifyToken, async (req, res) => {
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
        const hashedPassword = await bcryptjs_1.default.hash(mot_de_passe, 10);
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
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.get("/", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Accès interdit" });
        }
        const utilisateurs = await prisma.utilisateur.findMany({
            select: { id: true, nom: true, email: true, role: true, createdAt: true }
        });
        res.json(utilisateurs);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.get("/:id", verifyToken, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "ADMIN" && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: "Accès interdit" });
        }
        const { nom, email, role } = req.body;
        const updateData = { nom, email };
        if (req.user.role === "ADMIN") {
            updateData.role = role;
        }
        const utilisateur = await prisma.utilisateur.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: { id: true, nom: true, email: true, role: true, createdAt: true, updatedAt: true }
        });
        res.json(utilisateur);
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
        await prisma.utilisateur.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Utilisateur supprimé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur" });
    }
});
exports.default = router;

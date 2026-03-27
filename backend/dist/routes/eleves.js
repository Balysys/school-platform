"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
const SECRET = process.env.JWT_SECRET || 'your_secret_key';
// Middleware: Verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
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
// GET all students (ADMIN only) or students for PARENT
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role === 'ADMIN' || req.user.role === 'ENSEIGNANT') {
            // Get all students
            const eleves = await db_1.default.eleve.findMany({
                include: { classe: true, parent: { select: { nom: true, email: true } } },
                orderBy: { nom: 'asc' }
            });
            res.json(eleves);
        }
        else if (req.user.role === 'PARENT') {
            // Get only children of this parent
            const eleves = await db_1.default.eleve.findMany({
                where: { parentId: req.user.id },
                include: { classe: true, parent: { select: { nom: true, email: true } } }
            });
            res.json(eleves);
        }
        else {
            res.status(403).json({ message: "Accès refusé" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
// GET student by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const eleve = await db_1.default.eleve.findUnique({
            where: { id: parseInt(id) },
            include: {
                classe: true,
                parent: { select: { nom: true, email: true } }
            }
        });
        if (!eleve) {
            return res.status(404).json({ message: "Élève non trouvé" });
        }
        // PARENT can only see their own children
        if (req.user.role === 'PARENT' && eleve.parentId !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        res.json(eleve);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
// POST create new student (ADMIN only)
router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Seuls les administrateurs peuvent créer" });
        }
        const { nom, prenom, dateNaissance, classeId, parentId } = req.body;
        if (!nom || !prenom || !classeId) {
            return res.status(400).json({ message: "Données manquantes" });
        }
        const eleve = await db_1.default.eleve.create({
            data: {
                nom,
                prenom,
                dateNaissance: dateNaissance ? new Date(dateNaissance) : new Date(),
                classeId: parseInt(classeId),
                parentId: parentId ? parseInt(parentId) : null
            },
            include: { classe: true, parent: { select: { nom: true, email: true } } }
        });
        res.status(201).json(eleve);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
// PUT update student (ADMIN only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Accès refusé" });
        }
        const { id } = req.params;
        const { nom, prenom, dateNaissance, classeId, parentId } = req.body;
        const updateData = {};
        if (nom)
            updateData.nom = nom;
        if (prenom)
            updateData.prenom = prenom;
        if (dateNaissance)
            updateData.dateNaissance = new Date(dateNaissance);
        if (classeId)
            updateData.classeId = parseInt(classeId);
        if (parentId !== undefined)
            updateData.parentId = parseInt(parentId);
        const eleve = await db_1.default.eleve.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { classe: true, parent: { select: { nom: true, email: true } } }
        });
        res.json(eleve);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
// DELETE student (ADMIN only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: "Accès refusé" });
        }
        const { id } = req.params;
        await db_1.default.eleve.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Élève supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
exports.default = router;

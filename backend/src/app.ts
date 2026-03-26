import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes (we'll create these next)
import authRoutes from "./routes/auth";
import utilisateursRoutes from "./routes/utilisateurs";
import elevesRoutes from "./routes/eleves";
import classesRoutes from "./routes/classes";
import matieresRoutes from "./routes/matieres";
import periodesRoutes from "./routes/periodes";
import notesRoutes from "./routes/notes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/eleves", elevesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/matieres", matieresRoutes);
app.use("/api/periodes", periodesRoutes);
app.use("/api/notes", notesRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API des résultats scolaires - Bienvenue!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

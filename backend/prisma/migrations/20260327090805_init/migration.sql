-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PARENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Eleve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "classeId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,
    CONSTRAINT "Eleve_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Eleve_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Classe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "niveau" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Matiere" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "coeff" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Periode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eleveId" INTEGER NOT NULL,
    "matiereId" INTEGER NOT NULL,
    "periodeId" INTEGER NOT NULL,
    "enseignantId" INTEGER NOT NULL,
    "valeur" REAL NOT NULL,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Note_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "Eleve" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Eleve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "classeId" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Eleve_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Eleve_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Utilisateur" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Eleve" ("classeId", "dateNaissance", "id", "nom", "parentId", "prenom") SELECT "classeId", "dateNaissance", "id", "nom", "parentId", "prenom" FROM "Eleve";
DROP TABLE "Eleve";
ALTER TABLE "new_Eleve" RENAME TO "Eleve";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

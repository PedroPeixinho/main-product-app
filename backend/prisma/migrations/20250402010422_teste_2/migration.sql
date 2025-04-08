/*
  Warnings:

  - You are about to drop the column `teste` on the `Paciente` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paciente" (
    "cpf_fono" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "feedback" TEXT NOT NULL DEFAULT '',
    "dia_consulta" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'emAvaliacao',
    "horario_consulta" TEXT,
    "avatar_url" TEXT
);
INSERT INTO "new_Paciente" ("avatar_url", "cpf", "cpf_fono", "dia_consulta", "feedback", "horario_consulta", "nome", "status") SELECT "avatar_url", "cpf", "cpf_fono", "dia_consulta", "feedback", "horario_consulta", "nome", "status" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

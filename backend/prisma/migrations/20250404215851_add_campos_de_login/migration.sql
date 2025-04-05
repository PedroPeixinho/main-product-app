/*
  Warnings:

  - Added the required column `crfa` to the `Fono` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Fono` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Fono` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fono" (
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "crfa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Fono" ("cpf", "nome") SELECT "cpf", "nome" FROM "Fono";
DROP TABLE "Fono";
ALTER TABLE "new_Fono" RENAME TO "Fono";
CREATE UNIQUE INDEX "Fono_email_key" ON "Fono"("email");
CREATE TABLE "new_Paciente" (
    "cpf_fono" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "feedback" TEXT NOT NULL DEFAULT '',
    "dia_consulta" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'emAvaliacao',
    "horario_consulta" TEXT,
    "avatar_url" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Paciente" ("avatar_url", "cpf", "cpf_fono", "dia_consulta", "feedback", "horario_consulta", "nome", "status") SELECT "avatar_url", "cpf", "cpf_fono", "dia_consulta", "feedback", "horario_consulta", "nome", "status" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

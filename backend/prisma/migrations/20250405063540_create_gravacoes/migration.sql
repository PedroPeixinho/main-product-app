-- CreateTable
CREATE TABLE "Gravacoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_exercicio" INTEGER NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "cpf_paciente" TEXT NOT NULL,
    CONSTRAINT "Gravacoes_cpf_paciente_fkey" FOREIGN KEY ("cpf_paciente") REFERENCES "Paciente" ("cpf") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Gravacoes_id_exercicio_fkey" FOREIGN KEY ("id_exercicio") REFERENCES "Exercicios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

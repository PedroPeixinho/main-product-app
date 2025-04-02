-- CreateTable
CREATE TABLE "Paciente" (
    "cpf_fono" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "feedback" TEXT NOT NULL DEFAULT '',
    "dia_consulta" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'emAvaliacao',
    "horario_consulta" TEXT,
    "avatar_url" TEXT
);

-- CreateTable
CREATE TABLE "Duvidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf_paciente" TEXT NOT NULL,
    "data_hora" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Duvidas_cpf_paciente_fkey" FOREIGN KEY ("cpf_paciente") REFERENCES "Paciente" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Consultas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf_paciente" TEXT NOT NULL,
    "data_hora" TEXT NOT NULL,
    CONSTRAINT "Consultas_cpf_paciente_fkey" FOREIGN KEY ("cpf_paciente") REFERENCES "Paciente" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciciosRealizados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_exercicio" INTEGER NOT NULL,
    "nome_exercicio" TEXT NOT NULL,
    "duracao_video" REAL NOT NULL,
    "data" TEXT NOT NULL,
    "execucao" TEXT NOT NULL,
    "nota_execucao" REAL NOT NULL,
    "cpf_paciente" TEXT NOT NULL,
    CONSTRAINT "ExerciciosRealizados_cpf_paciente_fkey" FOREIGN KEY ("cpf_paciente") REFERENCES "Paciente" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fono" (
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Exercicios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_exercicio" TEXT NOT NULL,
    "repeticoes" INTEGER NOT NULL,
    "texto_descritivo" TEXT NOT NULL,
    "video_exemplo" TEXT,
    "cpf_fono" TEXT NOT NULL,
    "cpf_paciente" TEXT NOT NULL,
    "data_execucao" DATETIME NOT NULL,
    CONSTRAINT "Exercicios_cpf_fono_fkey" FOREIGN KEY ("cpf_fono") REFERENCES "Fono" ("cpf") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Exercicios_cpf_paciente_fkey" FOREIGN KEY ("cpf_paciente") REFERENCES "Paciente" ("cpf") ON DELETE CASCADE ON UPDATE CASCADE
);

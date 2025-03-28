const express = require("express");
const router = express.Router();
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    }
});

// Rota principal
router.get("/", (req, res) => {
    res.send("API funcionando!");
});

// Rota para buscar exercícios realizados por CPF
router.get("/exercicios/:cpf", (req, res) => {
    const cpf = req.params.cpf;
    console.log("Rota /exercicios/:cpf foi chamada");
    console.log("CPF recebido:", cpf);

    const query = `
      SELECT 
        exercicios_realizados.nome_exercicio, 
        exercicios_realizados.data, 
        exercicios_realizados.nota_execucao
      FROM exercicios_realizados
      INNER JOIN paciente ON exercicios_realizados.cpf_paciente = paciente.cpf
      WHERE paciente.cpf = ?
    `;

    console.log("Executando consulta SQL...");
    db.all(query, [cpf], (err, rows) => {
        if (err) {
            console.error("Erro ao executar a consulta:", err.message);
            return res.status(500).json({ error: "Erro ao buscar exercícios realizados." });
        }

        if (rows.length === 0) {
            console.log("Nenhum exercício encontrado para o CPF:", cpf);
            return res.status(404).json({ message: "Nenhum exercício encontrado para este CPF." });
        }

        console.log("Exercícios encontrados:", rows);
        res.json(rows);
    });
});


// Rota para buscar o nome do paciente por CPF
router.get("/pacientes/:cpf", (req, res) => {
    const cpf = req.params.cpf;
    console.log("Rota /pacientes/:cpf foi chamada");
    console.log("CPF recebido:", cpf);

    const query = `
      SELECT nome
      FROM paciente
      WHERE cpf = ?
    `;

    console.log("Executando consulta SQL para buscar o nome do paciente...");
    db.get(query, [cpf], (err, row) => {
        if (err) {
            console.error("Erro ao executar a consulta:", err.message);
            return res.status(500).json({ error: "Erro ao buscar o nome do paciente." });
        }

        if (!row) {
            console.log("Nenhum paciente encontrado para o CPF:", cpf);
            return res.status(404).json({ message: "Nenhum paciente encontrado para este CPF." });
        }

        console.log("Paciente encontrado:", row);
        res.json(row);
    });
});




module.exports = router;
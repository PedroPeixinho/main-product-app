const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, "../../database.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    }
});

// Criar novo exercício
const createExercise = (req, res) => {
    console.log("Recebido no backend:", req.body); // Adiciona um log para depuração

    const { nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao } = req.body;

    if (!nome_exercicio || !repeticoes || !texto_descritivo || !cpf_fono || !cpf_paciente || !data_execucao) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const query = `
        INSERT INTO exercicios (nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao], function (err) {
        if (err) {
            console.error("Erro ao criar exercício:", err.message);
            return res.status(500).json({ error: "Erro ao criar exercício." });
        }

        res.status(201).json({ message: "Exercício criado com sucesso.", id: this.lastID });
    });
};

// Listar todos os exercícios
const getAllExercises = (req, res) => {
    const query = `
        SELECT id, nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao
        FROM exercicios
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar exercícios:", err.message);
            return res.status(500).json({ error: "Erro ao buscar exercícios." });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhum exercício encontrado." });
        }

        res.json(rows);
    });
};

const getExercisesByCpf = (req, res) => {
    const cpf = req.params.cpf;

    const query = `
      SELECT nome_exercicio, repeticoes, texto_descritivo, video_exemplo, cpf_fono, cpf_paciente, data_execucao
        FROM exercicios
      INNER JOIN paciente ON exercicios.cpf_paciente = paciente.cpf
      WHERE paciente.cpf = ?
    `;

    db.all(query, [cpf], (err, rows) => {
        if (err) {
            console.error("Erro ao executar a consulta:", err.message);
            return res.status(500).json({ error: "Erro ao buscar exercícios realizados." });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Nenhum exercício encontrado para este CPF." });
        }

        res.json(rows);
    });
};
module.exports = {
    createExercise,
    getAllExercises,
    getExercisesByCpf
};
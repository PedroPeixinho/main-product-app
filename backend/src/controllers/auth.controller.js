const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    }
});

// Secret key para o JWT
const JWT_SECRET = process.env.JWT_SECRET;

exports.registerFono = (req, res) => {
    const { nome, cpf, crfa, email, senha } = req.body;

    // Checa se todos os campos estão presentes
    if (!nome || !cpf || !crfa || !email || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Valida CPF (somente números, com 11 dígitos)
    if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ error: "CPF deve conter apenas 11 números." });
    }

    // Valida tamanho da senha (maior que 6 caracteres)
    if (senha.length < 6) {
        return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }

    // Checa se email ou cpf já existe
    const checkQuery = "SELECT * FROM fono WHERE email = ? OR cpf = ?";
    db.get(checkQuery, [email, cpf], (err, row) => {
        if (err) {
            console.error("Erro ao verificar fono:", err.message);
            return res.status(500).json({ error: "Erro ao verificar fono." });
        }
        if (row) {
            return res.status(400).json({ error: "Email ou CPF já cadastrado." });
        }

        bcrypt.hash(senha, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Erro ao hashear senha:", err.message);
                return res.status(500).json({ error: "Erro ao processar senha." });
            }

            const insertQuery = "INSERT INTO fono (cpf, nome, crfa, email, senha) VALUES (?, ?, ?, ?, ?)";
            db.run(insertQuery, [cpf, nome, crfa, email, hashedPassword], function (err) {
                if (err) {
                    console.error("Erro ao registrar fono:", err.message);
                    return res.status(500).json({ error: "Erro ao registrar fono." });
                }

                const token = jwt.sign({ cpf, is_fono: true }, JWT_SECRET, { expiresIn: "1h" });

                res.status(201).json({ message: "Fono cadastrado com sucesso!", token });
            });
        });
    });
};

exports.loginFono = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const query = "SELECT * FROM fono WHERE email = ?";
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Erro ao buscar fono:", err.message);
            return res.status(500).json({ error: "Erro ao buscar fono." });
        }

        if (!row) {
            return res.status(401).json({ error: "Email ou senha inválidos." });
        }

        bcrypt.compare(senha, row.senha, (err, isMatch) => {
            if (err) {
                console.error("Erro ao comparar senhas:", err.message);
                return res.status(500).json({ error: "Erro ao verificar senha." });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Email ou senha inválidos." });
            }

            const token = jwt.sign(
                { cpf: row.cpf, is_fono: true },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({ message: "Login bem sucedido!", token });
        });
    });
};


exports.getFonoDetails = (req, res) => {
    const cpf = req.user.cpf;

    const query = `SELECT cpf, nome, crfa, email FROM fono WHERE cpf = ?`;

    db.get(query, [cpf], (err, row) => {
        if (err) {
            console.error("Erro ao buscar dados do fono:", err.message);
            return res.status(500).json({ error: "Erro ao buscar informações do fono." });
        }

        if (!row) {
            return res.status(404).json({ error: "Fono não encontrado." });
        }

        res.json(row);
    });
};


exports.registerPatient = (req, res) => {
    const { cpf_fono, nome, cpf, feedback, nome_usuario, senha } = req.body;

    // Checa se todos os campos estão presentes
    if (!cpf_fono || !nome || !cpf || !feedback || !nome_usuario || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Valida CPF (somente números, com 11 dígitos)
    if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ error: "CPF deve conter apenas 11 números." });
    }

    // Valida tamanho da senha (maior que 6 caracteres)
    if (senha.length < 6) {
        return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }

    // Checa se nome_usuario ou cpf já existe
    const checkQuery = "SELECT * FROM paciente WHERE nome_usuario = ? OR cpf = ?";
    db.get(checkQuery, [nome_usuario, cpf], (err, row) => {
        if (err) {
            console.error("Erro ao verificar paciente:", err.message);
            return res.status(500).json({ error: "Erro ao verificar paciente." });
        }
        if (row) {
            return res.status(400).json({ error: "Nome de usuário ou CPF já cadastrado." });
        }

    bcrypt.hash(senha, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Erro ao hashear senha:", err.message);
            return res.status(500).json({ error: "Erro ao processar senha." });
        }

        const insertQuery = "INSERT INTO paciente (cpf_fono, nome, cpf, feedback, nome_usuario, senha) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(insertQuery, [cpf_fono, nome, cpf, feedback, nome_usuario, hashedPassword], function (err) {
            if (err) {
                console.error("Erro ao registrar paciente:", err.message);
                return res.status(500).json({ error: "Erro ao registrar paciente." });
            }

            const token = jwt.sign({ cpf, is_fono: false }, JWT_SECRET, { expiresIn: "1h" });

            res.status(201).json({ message: "Paciente cadastrado com sucesso!", token });
        });
    });
    });
};


exports.loginPatient = (req, res) => {
    const { nome_usuario, senha } = req.body;

    if (!nome_usuario || !senha) {
        return res.status(400).json({ error: "Nome de usuário e senha são obrigatórios." });
    }

    const query = "SELECT * FROM paciente WHERE nome_usuario = ?";
    db.get(query, [nome_usuario], (err, row) => {
        if (err) {
            console.error("Erro ao buscar paciente:", err.message);
            return res.status(500).json({ error: "Erro ao buscar paciente." });
        }

        if (!row) {
            return res.status(401).json({ error: "Nome de usuário ou senha inválidos." });
        }

        bcrypt.compare(senha, row.senha, (err, isMatch) => {
            if (err) {
                console.error("Erro ao comparar senhas:", err.message);
                return res.status(500).json({ error: "Erro ao verificar senha." });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Nome de usuário ou senha inválidos." });
            }

            const token = jwt.sign(
                { cpf: row.cpf, is_fono: false },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({ message: "Login bem sucedido!", token });
        });
    });
};


exports.getPatientDetails = (req, res) => {
    const cpf = req.user.cpf;

    const query = `SELECT cpf_fono, nome, cpf, feedback, nome_usuario FROM paciente WHERE cpf = ?`;

    db.get(query, [cpf], (err, row) => {
        if (err) {
            console.error("Erro ao buscar dados do paciente:", err.message);
            return res.status(500).json({ error: "Erro ao buscar informações do paciente." });
        }

        if (!row) {
            return res.status(404).json({ error: "Paciente não encontrado." });
        }

        res.json(row);
    });
};
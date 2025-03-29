const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, "../db/database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  }
});

class PacienteController {
  getAllPacientes(req, res) {
    const query = `
      SELECT *
      FROM paciente
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Erro ao buscar pacientes:", err.message);
        return res.status(500).json({ error: "Erro ao buscar pacientes." });
      }

      res.status(200).json(rows);
    });
  }

  getAllPacientesDuvidas(req, res) {
    const query = `
      SELECT 
        p.nome, 
        p.cpf, 
        p.avatar_url, 
        COUNT(d.cpf_paciente) AS qtd_duvidas_nao_lidas,
        MAX(d.data_hora) AS ultima_duvida
      FROM paciente p
      LEFT JOIN duvidas d ON p.cpf = d.cpf_paciente AND d.lida = 0
      GROUP BY p.cpf
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("teste");
        console.log("Erro ao buscar dúvidas dos pacientes:", err.message);
        return res
          .status(500)
          .json({ error: "Erro ao buscar dúvidas dos pacientes." });
      }

      res.status(200).json(rows);
    });
  }

  getAllPacientesConsultas(req, res) {
    const query = `
      SELECT 
      c.id,
      p.nome, 
      c.data_hora
      FROM paciente p
      INNER JOIN consultas c ON p.cpf = c.cpf_paciente
      WHERE c.data_hora > datetime('now')
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log(
          "Erro ao buscar consultas futuras dos pacientes:",
          err.message
        );
        return res
          .status(500)
          .json({ error: "Erro ao buscar consultas futuras dos pacientes." });
      }

      res.status(200).json(rows);
    });
  }
}

module.exports = PacienteController;

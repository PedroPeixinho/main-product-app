const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

const cpf = "12345678900";

const query = `
  SELECT 
    exercicios_realizados.nome_exercicio, 
    exercicios_realizados.data, 
    exercicios_realizados.nota_execucao
  FROM exercicios_realizados
  INNER JOIN paciente ON exercicios_realizados.cpf_paciente = paciente.cpf
  WHERE paciente.cpf = ?
`;

db.all(query, [cpf], (err, rows) => {
  if (err) {
    console.error("Erro ao executar a consulta:", err.message);
  } else if (rows.length === 0) {
    console.log("Nenhum exercício encontrado para o CPF:", cpf);
  } else {
    console.log("Exercícios encontrados:", rows);
  }
  db.close();
});
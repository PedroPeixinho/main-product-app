// Função para buscar exercícios realizados por CPF
const getExercisesByCpf = (req, res) => {
  const cpf = req.params.cpf;

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
      return res
        .status(500)
        .json({ error: "Erro ao buscar exercícios realizados." });
    }

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum exercício encontrado para este CPF." });
    }

    res.json(rows);
  });
};

// Função para buscar o nome do paciente por CPF
const getPatientNameByCpf = (req, res) => {
  const cpf = req.params.cpf;

  const query = `
      SELECT nome
      FROM paciente
      WHERE cpf = ?
    `;

  db.get(query, [cpf], (err, row) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err.message);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o nome do paciente." });
    }

    if (!row) {
      return res
        .status(404)
        .json({ message: "Nenhum paciente encontrado para este CPF." });
    }

    res.json(row);
  });
};

// Função para adicionar feedback ao paciente
const addFeedbackToPatient = (req, res) => {
  const cpf = req.params.cpf;
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: "O campo 'feedback' é obrigatório." });
  }

  const query = `
        UPDATE paciente
        SET feedback = feedback || '\n' || ?
        WHERE cpf = ?
    `;

  db.run(query, [feedback, cpf], function (err) {
    if (err) {
      console.error("Erro ao adicionar feedback:", err.message);
      return res.status(500).json({ error: "Erro ao adicionar feedback." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }

    res.status(200).json({ message: "Feedback adicionado com sucesso." });
  });
};

module.exports = {
  getExercisesByCpf,
  getPatientNameByCpf,
  addFeedbackToPatient,
};

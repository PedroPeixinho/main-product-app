const { PrismaClient } = require("../../generated/prisma/index");

const prisma = new PrismaClient();

// Função para buscar exercícios realizados por CPF
const getExercisesByCpf = async (req, res) => {
  const cpf = req.params.cpf;

  try {
    const query = `
    SELECT 
      ExerciciosRealizados.nome_exercicio, 
      ExerciciosRealizados.data, 
      ExerciciosRealizados.nota_execucao
    FROM ExerciciosRealizados
    INNER JOIN paciente ON ExerciciosRealizados.cpf_paciente = paciente.cpf
    WHERE paciente.cpf = ?
  `;

    const exercises = await prisma.$queryRawUnsafe(query, cpf);

    if (exercises.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum exercício encontrado para este CPF." });
    }

    res.json(exercises);
  } catch (error) {
    console.error("Erro ao buscar exercícios realizados:", error.message);
    res.status(500).json({ error: "Erro ao buscar exercícios realizados." });
  }
};

// Função para buscar o nome do paciente por CPF
const getPatientNameByCpf = async (req, res) => {
  const cpf = req.params.cpf;

  try {
    const patient = await prisma.paciente.findUnique({
      where: {
        cpf: cpf,
      },
      select: {
        nome: true,
      },
    });

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Nenhum paciente encontrado para este CPF." });
    }

    res.json(patient);
  } catch (error) {
    console.error("Erro ao buscar o nome do paciente:", error.message);
    res.status(500).json({ error: "Erro ao buscar o nome do paciente." });
  }
};

// Função para adicionar feedback ao paciente
const addFeedbackToPatient = async (req, res) => {
  const cpf = req.params.cpf;
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: "O campo 'feedback' é obrigatório." });
  }

  try {
    const query = `
      UPDATE paciente
      SET feedback = feedback || '\n' || ?
      WHERE cpf = ?
    `;

    await prisma.$executeRawUnsafe(query, feedback, cpf);

    res.status(200).json({ message: "Feedback adicionado com sucesso." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    console.error("Erro ao adicionar feedback:", error.message);
    res.status(500).json({ error: "Erro ao adicionar feedback." });
  }
};

module.exports = {
  getExercisesByCpf,
  getPatientNameByCpf,
  addFeedbackToPatient,
};

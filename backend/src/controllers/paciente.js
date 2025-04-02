const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();

class PacienteController {
  async getAllPacientes(req, res) {
    try {
      const pacientes = await prisma.paciente.findMany();
      res.status(200).json(pacientes);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err.message);
      res.status(500).json({ error: "Erro ao buscar pacientes." });
    }
  }

  async getAllPacientesDuvidas(req, res) {
    try {
      const pacientesDuvidas = await prisma.paciente.findMany({
        select: {
          nome: true,
          cpf: true,
          avatar_url: true,
          duvidas: {
            where: { lida: false },
            select: {
              data_hora: true,
            },
          },
        },
      });

      const formattedPacientesDuvidas = pacientesDuvidas.map((paciente) => ({
        nome: paciente.nome,
        cpf: paciente.cpf,
        avatar_url: paciente.avatar_url,
        qtd_duvidas_nao_lidas: paciente.duvidas.length,
        ultima_duvida: paciente.duvidas.length
          ? paciente.duvidas.reduce((latest, current) =>
              latest.data_hora > current.data_hora ? latest : current
            ).data_hora
          : null,
      }));
      res.status(200).json(formattedPacientesDuvidas);
    } catch (err) {
      console.error("Erro ao buscar dúvidas dos pacientes:", err.message);
      res.status(500).json({ error: "Erro ao buscar dúvidas dos pacientes." });
    }
  }
}

module.exports = PacienteController;

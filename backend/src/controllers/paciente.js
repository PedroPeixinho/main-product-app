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
      const pacientesDuvidas = await prisma.$queryRaw`
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
      const formattedPacientesDuvidas = pacientesDuvidas.map((paciente) => ({
        ...paciente,
        qtd_duvidas_nao_lidas: Number(paciente.qtd_duvidas_nao_lidas),
      }));
      res.status(200).json(formattedPacientesDuvidas);
    } catch (err) {
      console.error("Erro ao buscar dúvidas dos pacientes:", err.message);
      res.status(500).json({ error: "Erro ao buscar dúvidas dos pacientes." });
    }
  }

  async getAllPacientesConsultas(req, res) {
    try {
      const pacientesConsultas = await prisma.$queryRaw`
        SELECT 
          c.id,
          p.nome, 
          c.data_hora
        FROM paciente p
        INNER JOIN consultas c ON p.cpf = c.cpf_paciente
        WHERE c.data_hora >= datetime('now')
      `;
      res.status(200).json(pacientesConsultas);
    } catch (err) {
      console.error(
        "Erro ao buscar consultas futuras dos pacientes:",
        err.message
      );
      res
        .status(500)
        .json({ error: "Erro ao buscar consultas futuras dos pacientes." });
    }
  }
}

module.exports = PacienteController;

const { PrismaClient } = require("../generated/prisma/index");

const prisma = new PrismaClient();

async function main() {
  // Inserir ou atualizar o paciente
  const cpfPaciente = "12345678900";
  const diaConsulta = 2;
  const status = "emAcompanhamento";
  const horarioConsulta = "14:30";
  const avatarUrl = "https://avatars.githubusercontent.com/u/55458349?v=4";

  await prisma.paciente.upsert({
    where: { cpf: cpfPaciente },
    update: {
      dia_consulta: diaConsulta,
      status: status,
      horario_consulta: horarioConsulta,
      avatar_url: avatarUrl,
    },
    create: {
      cpf_fono: "98765432100",
      nome: "Miguel Oliveira",
      cpf: cpfPaciente,
      dia_consulta: diaConsulta,
      status: status,
      horario_consulta: horarioConsulta,
      avatar_url: avatarUrl,
    },
  });

  // Inserir uma dúvida
  const dataHora = new Date("2025-03-29T16:07:10-03:00").toString();
  const mensagem = "Como melhorar minha execução nos exercícios?";

  await prisma.duvidas.create({
    data: {
      cpf_paciente: cpfPaciente,
      data_hora: dataHora,
      mensagem: mensagem,
    },
  });

  // Inserir 5 pacientes e 3 dúvidas para cada um
  const pacientes = [
    {
      cpf: "11111111111",
      nome: "João Silva",
      dia_consulta: 1,
      status: "emAcompanhamento",
      horario_consulta: "09:00",
      avatar_url: "",
    },
    {
      cpf: "22222222222",
      nome: "Maria Santos",
      dia_consulta: 2,
      status: "emAvaliacao",
      horario_consulta: "10:30",
      avatar_url: "",
    },
    {
      cpf: "33333333333",
      nome: "Carlos Lima",
      dia_consulta: 3,
      status: "concluido",
      horario_consulta: "11:45",
      avatar_url: "",
    },
    {
      cpf: "44444444444",
      nome: "Ana Costa",
      dia_consulta: 4,
      status: "emAcompanhamento",
      horario_consulta: "13:15",
      avatar_url: "",
    },
    {
      cpf: "55555555555",
      nome: "Pedro Almeida",
      dia_consulta: 5,
      status: "emAvaliacao",
      horario_consulta: "15:00",
      avatar_url: "",
    },
  ];

  for (const paciente of pacientes) {
    await prisma.paciente.upsert({
      where: { cpf: paciente.cpf },
      update: {
        dia_consulta: paciente.dia_consulta,
        status: paciente.status,
        horario_consulta: paciente.horario_consulta,
        avatar_url: paciente.avatar_url,
      },
      create: {
        cpf_fono: "98765432100",
        nome: paciente.nome,
        cpf: paciente.cpf,
        dia_consulta: paciente.dia_consulta,
        status: paciente.status,
        horario_consulta: paciente.horario_consulta,
        avatar_url: paciente.avatar_url,
      },
    });

    const duvidas = [
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T10:00:00").toString(),
        mensagem: `Dúvida 1 do paciente ${paciente.nome}`,
      },
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T11:00:00").toString(),
        mensagem: `Dúvida 2 do paciente ${paciente.nome}`,
      },
      {
        cpf_paciente: paciente.cpf,
        data_hora: new Date("2025-03-29T12:00:00").toString(),
        mensagem: `Dúvida 3 do paciente ${paciente.nome}`,
      },
    ];

    for (const duvida of duvidas) {
      await prisma.duvidas.create({ data: duvida });
    }
  }

  // Inserir consultas para os pacientes
  const consultas = [
    {
      cpf_paciente: "11111111111",
      data_hora: new Date("2024-03-30T09:00:00").toString(),
    },
    {
      cpf_paciente: "22222222222",
      data_hora: new Date("2025-03-30T10:30:00").toString(),
    },
    {
      cpf_paciente: "33333333333",
      data_hora: new Date("2023-03-30T11:45:00").toString(),
    },
    {
      cpf_paciente: "44444444444",
      data_hora: new Date("2025-04-02T13:15:00").toString(),
    },
    {
      cpf_paciente: "55555555555",
      data_hora: new Date("2025-03-30T15:00:00").toString(),
    },
  ];

  for (const consulta of consultas) {
    await prisma.consultas.create({ data: consulta });
  }

  // Inserir dois exercícios realizados pelo paciente
  const exercicios = [
    {
      id_exercicio: 1,
      nome_exercicio: "Lateralizar",
      duracao_video: 12.5,
      data: new Date("2025-03-28").toString(),
      execucao: "Completo",
      nota_execucao: 4.5,
      cpf_paciente: cpfPaciente,
    },
    {
      id_exercicio: 2,
      nome_exercicio: "Afilar",
      duracao_video: 8.0,
      data: new Date("2025-03-28").toString(),
      execucao: "Completo",
      nota_execucao: 3.8,
      cpf_paciente: cpfPaciente,
    },
  ];

  for (const exercicio of exercicios) {
    await prisma.exerciciosRealizados.create({ data: exercicio });
  }

  console.log("Dados inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

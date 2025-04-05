const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerFono = async (req, res) => {
  const { nome, cpf, crfa, email, senha } = req.body;

  if (!nome || !cpf || !crfa || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  if (!/^\d{11}$/.test(cpf)) {
    return res.status(400).json({ error: "CPF deve conter apenas 11 números." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
  }

  try {
    const existingFono = await prisma.fono.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });
    if (existingFono) {
      return res.status(400).json({ error: "Email ou CPF já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    await prisma.fono.create({
      data: { cpf, nome, crfa, email, senha: hashedPassword },
    });

    const token = jwt.sign({ cpf, is_fono: true }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Fono cadastrado com sucesso!", token });
  } catch (err) {
    console.error("Erro ao registrar fono:", err.message);
    res.status(500).json({ error: "Erro ao registrar fono." });
  }
};

exports.loginFono = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const fono = await prisma.fono.findUnique({ where: { email } });
    if (!fono || !(await bcrypt.compare(senha, fono.senha))) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const token = jwt.sign({ cpf: fono.cpf, is_fono: true }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login bem sucedido!", token });
  } catch (err) {
    console.error("Erro ao fazer login:", err.message);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

exports.getFonoDetails = async (req, res) => {
  const cpf = req.user.cpf;
  try {
    const fono = await prisma.fono.findUnique({
      where: { cpf },
      select: { cpf: true, nome: true, crfa: true, email: true },
    });
    if (!fono) return res.status(404).json({ error: "Fono não encontrado." });
    res.json(fono);
  } catch (err) {
    console.error("Erro ao buscar dados do fono:", err.message);
    res.status(500).json({ error: "Erro ao buscar informações do fono." });
  }
};

exports.registerPatient = async (req, res) => {
  const { cpf_fono, nome, cpf, feedback, nome_usuario, senha } = req.body;

  if (!cpf_fono || !nome || !cpf || !feedback || !nome_usuario || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  if (!/^\d{11}$/.test(cpf)) {
    return res.status(400).json({ error: "CPF deve conter apenas 11 números." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
  }
  const email = nome_usuario;
  try {
    const existingPaciente = await prisma.paciente.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });
    if (existingPaciente) {
      return res.status(400).json({ error: "Nome de usuário ou CPF já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    await prisma.paciente.create({
      data: { cpf_fono, nome, cpf, feedback, email, senha: hashedPassword },
    });

    const token = jwt.sign({ cpf, is_fono: false }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "Paciente cadastrado com sucesso!", token });
  } catch (err) {
    console.error("Erro ao registrar paciente:", err.message);
    res.status(500).json({ error: "Erro ao registrar paciente." });
  }
};

exports.loginPatient = async (req, res) => {
  const { nome_usuario, senha } = req.body;

  if (!nome_usuario || !senha) {
    return res.status(400).json({ error: "Nome de usuário e senha são obrigatórios." });
  }
  const email = nome_usuario;
  try {
    const paciente = await prisma.paciente.findUnique({ where: { email } });
    if (!paciente || !(await bcrypt.compare(senha, paciente.senha))) {
      return res.status(401).json({ error: "Nome de usuário ou senha inválidos." });
    }

    const token = jwt.sign({ cpf: paciente.cpf, is_fono: false }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login bem sucedido!", token });
  } catch (err) {
    console.error("Erro ao fazer login do paciente:", err.message);
    res.status(500).json({ error: "Erro ao fazer login do paciente." });
  }
};

exports.getPatientDetails = async (req, res) => {
  const cpf = req.user.cpf;
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { cpf },
      select: {
        cpf_fono: true,
        nome: true,
        cpf: true,
        feedback: true,
        email: true,
      },
    });
    if (!paciente) return res.status(404).json({ error: "Paciente não encontrado." });
    res.json(paciente);
  } catch (err) {
    console.error("Erro ao buscar dados do paciente:", err.message);
    res.status(500).json({ error: "Erro ao buscar informações do paciente." });
  }
};

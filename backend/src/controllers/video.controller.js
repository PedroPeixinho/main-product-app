const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const path = require("path");
// Criar pasta de uploads se não existir
const uploadDir = path.resolve(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Função para fazer upload de vídeo
exports.uploadVideo = async (req, res) => {
  console.log("Recebendo vídeo...");
  try {
    const { cpf, id_exercicio } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum vídeo enviado." });
    }

    ///i dsai iksadmkmsad mokasomd msajm
    const video = req.file;

    const videoPath = `/uploads/videos/${req.file.filename}`;
    await prisma.gravacoes.create({
      data: {
        caminho_arquivo: videoPath,
        cpf_paciente: cpf,
        id_exercicio: parseInt(id_exercicio),
      },
    });
    console.log("Vídeo salvo no banco de dados com sucesso.");
    res.status(200).json({ resultado: "correto", videoPath });
  } catch (err) {
    console.error("Erro ao salvar vídeo:", err);
    res.status(500).json({ error: "Erro ao salvar vídeo." });
  }
};

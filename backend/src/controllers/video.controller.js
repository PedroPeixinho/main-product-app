const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

const api = axios.create({
  baseURL: `${process.env.API_AI}/`,
});

// Criar pasta de uploads se não existir
const uploadDir = path.resolve(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadVideo = async (req, res) => {
  console.log("Recebendo vídeo...");
  try {
    const { cpf, id_exercicio } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Nenhum vídeo enviado." });
    }

    const video = req.file;
    const videoPath = `/uploads/videos/${video.filename}`;
    
    // Salva no banco
    await prisma.gravacoes.create({
      data: {
        caminho_arquivo: videoPath,
        cpf_paciente: cpf,
        id_exercicio: parseInt(id_exercicio),
      },
    });

    console.log("Vídeo salvo no banco de dados com sucesso.");

    await sendToAvaliable(video, id_exercicio.toString());

    res.status(200).json({ resultado: "correto", videoPath });
  } catch (err) {
    console.error("Erro ao salvar vídeo:", err);
    res.status(500).json({ error: "Erro ao salvar vídeo." });
  }
};

async function sendToAvaliable(video, nome_exercicio) {
  try {
    const videoStream = fs.createReadStream(video.path);
    const formData = new FormData();
    
    formData.append("nome_exercicio", nome_exercicio);
    
    //Versao para um só pc
    formData.append("video", video.path);
    
    //Versao para o dois pcs
    //formData.append("video", videoStream, video.filename);

    const response = await api.post(`/upload/`, formData, {
      headers: formData.getHeaders(),
    });

    console.log("Vídeo enviado para a i.a:", response.data);
  } catch (error) {
    console.error("Erro ao enviar vídeo para backend Python:", error.message);
  }
}
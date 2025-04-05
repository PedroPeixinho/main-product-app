const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const multer = require("multer");

path = require("path");

// Configuração do Multer para armazenar vídeos na pasta "uploads/videos"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/videos"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// Rotas
router.post("/patient/:cpf/exercicies/:id_exercicio/video", upload.single("video"), videoController.uploadVideo);

module.exports = router;
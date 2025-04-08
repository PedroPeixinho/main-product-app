const express = require("express");
const router = express.Router();
const ExerConcluidos = require("../controllers/exerConcluido.controller");

router.get("/", ExerConcluidos.teste);

module.exports = router;

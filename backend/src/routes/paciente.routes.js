const express = require("express");
const router = express.Router();
const PacienteController = require("../controllers/paciente");

const pacienteController = new PacienteController();

router.get("/", pacienteController.getAllPacientes);
router.get("/duvidas", pacienteController.getAllPacientesDuvidas);
router.get("/consultas", pacienteController.getAllPacientesConsultas);

module.exports = router;

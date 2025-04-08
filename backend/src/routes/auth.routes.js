const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Rotas
router.post("/fono/register", authController.registerFono);
router.post("/fono/login", authController.loginFono);
router.get("/fono/details", authMiddleware, authController.getFonoDetails);

router.post("/patient/register", authController.registerPatient);
router.post("/patient/login", authController.loginPatient);
router.get("/patient/details", authMiddleware, authController.getPatientDetails);

module.exports = router;

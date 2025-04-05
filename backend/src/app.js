require("dotenv").config();
const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const router = require("./routes/progresso.routes");
const pacienteRoutes = require("./routes/paciente.routes");
// app.use("/progresso", router);
app.use("/pacientes", pacienteRoutes);

const exerConcluido = require("./routes/exerConcluido.routes");
app.use("/concluidos", exerConcluido);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

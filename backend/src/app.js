const express = require("express");
var cors = require('cors')
const app = express();
const router = require("./views/exemplo.routes");

app.use(express.json()); 

app.use(cors())

app.use("/", router);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
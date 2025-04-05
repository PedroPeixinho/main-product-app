const { PrismaClient } = require("../../generated/prisma/index");
const prisma = new PrismaClient();

exports.teste = async (req, res) => {
    res.json({ message: "Hello World" });
};
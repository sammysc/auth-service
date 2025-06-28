const express = require("express");
const cors = require("cors");

const app = express();
const port = 3002;
const { router: authRouter } = require("./routes/auth");
//const { swaggerUi, specs } = require("./Swagger/swagger");

app.use(
    cors({
        origin: "http://localhost:3002",
        credentials: true,
    })
);

app.use(express.json());
app.use("/auth", authRouter);

// Configurar o Swagger
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("Bem-vindo à Plataforma Educacional Tech Challenge Fiap!");
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

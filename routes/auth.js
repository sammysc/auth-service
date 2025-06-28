const express = require("express");
const router = express.Router();
const { Teacher, Student } = require("../models"); // Importar os modelos de Teacher e Student 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "plataforma_educacional_secret";
const SALT_ROUNDS = 10;

// Endpoint de registro unificado para alunos e professores
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validações básicas
    if (!name || !email || !password || !userType) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    if (userType !== "teacher" && userType !== "student") {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    // Verificar se email já existe em algum dos modelos
    let existingUser;
    if (userType === "teacher") {
      existingUser = await Teacher.findOne({ where: { email } });
    } else {
      existingUser = await Student.findOne({ where: { email } });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Criar o usuário baseado no tipo
    let user;
    if (userType === "teacher") {
      user = await Teacher.create({
        name,
        email,
        password: hashedPassword,
      });
    } else {
      user = await Student.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retornar usuário criado sem expor a senha
    user.password = undefined;

    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      user,
      token,
      userType,
    });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message) });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// Endpoint de login unificado para alunos e professores
router.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validações básicas
    if (!email || !password || !userType) {
      return res
        .status(400)
        .json({ error: "Email, senha e tipo de usuário são obrigatórios" });
    }

    if (userType !== "teacher" && userType !== "student") {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    // Buscar usuário pelo email baseado no tipo
    let user;
    if (userType === "teacher") {
      user = await Teacher.findOne({ where: { email } });
    } else {
      user = await Student.findOne({ where: { email } });
    }

    // Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retornar informações do usuário sem expor a senha
    user = user.toJSON();
    delete user.password;

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user,
      token,
      userType,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao realizar login" });
  }
});

// Middleware para verificar a autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }

    req.user = user;
    next();
  });
};

// Rota protegida para obter perfil do usuário logado
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { id, userType } = req.user;

    let user;
    if (userType === "teacher") {
      user = await Teacher.findByPk(id);
    } else {
      user = await Student.findByPk(id);
    }

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Retornar informações do usuário sem expor a senha
    user = user.toJSON();
    delete user.password;

    return res.status(200).json({ user, userType });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao obter perfil do usuário" });
  }
});

module.exports = { router, authenticateToken };

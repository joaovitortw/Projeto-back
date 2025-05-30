const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken } = require('../services/jwt_service');
const db = require('../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { login, senha, tipo } = req.body;

  if (!login || !senha || !tipo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const existente = await db.User.findOne({ where: { login } });
    if (existente) return res.status(409).json({ error: "Usuário já cadastrado" });

    const hash = await bcrypt.hash(senha, 10);
    const novoUsuario = await db.User.create({ login, senha: hash, tipo });

    res.status(201).json({ message: "Usuário registrado com sucesso", login: novoUsuario.login });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor", detalhe: err.message });
  }
};

exports.login = async (req, res) => {
  const { login, senha } = req.body;

  try {
    const usuario = await db.User.findOne({ where: { login } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: "Login ou senha inválidos" });
    }

    const payload = { login: usuario.login, tipo: usuario.tipo };
    const accessToken = gerarAccessToken(payload);
    const refreshToken = gerarRefreshToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // deixe como true em produção com HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login realizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao autenticar", detalhe: err.message });
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json({ error: "Refresh token não fornecido" });

  try {
    const payload = verificarRefreshToken(refreshToken);
    const novoAccessToken = gerarAccessToken({
      login: payload.login,
      tipo: payload.tipo
    });

    res.cookie("accessToken", novoAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: "Token renovado com sucesso" });
  } catch (err) {
    return res.status(403).json({ error: "Refresh token inválido ou expirado" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout efetuado com sucesso" });
};

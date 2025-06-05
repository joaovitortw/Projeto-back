<<<<<<< HEAD
const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken } = require('../services/jwt_service');
const db = require('../models');
=======
>>>>>>> parent of 0869932 (Autenticação, sessões e rotas organizadas)
const bcrypt = require('bcryptjs');
const db = require('../models');
const UniLogin = db.uni_login;
const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken } = require('../services/jwt_service');

<<<<<<< HEAD
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
=======
module.exports = {
  async register(req, res) {
    const { login, senha, confirmSenha } = req.body;

    try {
      if (!login || !senha || !confirmSenha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      if (senha !== confirmSenha) {
        return res.status(400).json({ error: 'Senhas não coincidem.' });
      }

      const userExists = await UniLogin.findOne({ where: { login } });

      if (userExists) {
        return res.status(400).json({ error: 'Login já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const user = await UniLogin.create({ login, senha: hashedPassword });

      return res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        user: { login: user.login }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no registro.', details: error.message });
    }
  },

  async login(req, res) {
    const { login, senha } = req.body;

    try {
      if (!login || !senha) {
        return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
      }

      const user = await UniLogin.findOne({ where: { login } });

      if (!user) {
        return res.status(401).json({ error: 'Login inválido.' });
      }

      const passwordMatch = await bcrypt.compare(senha, user.senha);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const payload = { login: user.login };

      const accessToken = gerarAccessToken(payload);
      const refreshToken = gerarRefreshToken(payload);

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        accessToken,
        refreshToken,
        user: { login: user.login }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no login.', details: error.message });
    }
  },

  async refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token não enviado.' });
    }

    try {
      const decoded = verificarRefreshToken(refreshToken);

      const user = await UniLogin.findOne({ where: { login: decoded.login } });

      if (!user) {
        return res.status(403).json({ error: 'Refresh Token inválido.' });
      }
>>>>>>> parent of 0869932 (Autenticação, sessões e rotas organizadas)

      const novoAccessToken = gerarAccessToken({ login: user.login });

      return res.json({ accessToken: novoAccessToken });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao renovar token.', details: error.message });
    }
  },

  async logout(req, res) {
    return res.json({ message: 'Logout realizado com sucesso (sem persistência).' });
  }
};
<<<<<<< HEAD

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
=======
>>>>>>> parent of 0869932 (Autenticação, sessões e rotas organizadas)

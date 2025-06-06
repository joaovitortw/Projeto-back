const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.user;
const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken } = require('../services/jwt_service');

module.exports = {
  async register(req, res) {
    const { login, senha, confirmSenha, tipo } = req.body;

    if (!login || !senha || !confirmSenha || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (senha !== confirmSenha) {
      return res.status(400).json({ error: 'Senhas não coincidem.' });
    }

    try {
      const userExists = await UniLogin.findOne({ where: { login } });
      if (userExists) return res.status(409).json({ error: 'Usuário já cadastrado.' });

      const hashedPassword = await bcrypt.hash(senha, 10);
      const user = await UniLogin.create({ login, senha: hashedPassword, tipo });

      return res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        user: { login: user.login, tipo: user.tipo }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor.', details: error.message });
    }
  },

  async login(req, res) {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
    }

    try {
      const user = await UniLogin.findOne({ where: { login } });
      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: 'Login ou senha inválidos' });
      }

      const payload = { login: user.login, tipo: user.tipo };
      const accessToken = gerarAccessToken(payload);
      const refreshToken = gerarRefreshToken(payload);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Altere para true em produção com HTTPS
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: { login: user.login, tipo: user.tipo }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno no login.', details: error.message });
    }
  },

  async refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token não fornecido' });
    }

    try {
      const payload = verificarRefreshToken(refreshToken);
      const novoAccessToken = gerarAccessToken({ login: payload.login, tipo: payload.tipo });

      res.cookie("accessToken", novoAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });

      return res.status(200).json({ message: 'Token renovado com sucesso' });
    } catch (error) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado' });
    }
  },

  logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: 'Logout efetuado com sucesso' });
  }
};

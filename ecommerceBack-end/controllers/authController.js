const bcrypt = require('bcryptjs');
const db = require('../models');
const UniLogin = db.uni_login;
const { gerarAccessToken, gerarRefreshToken, verificarRefreshToken } = require('../services/jwt_service');

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

      const novoAccessToken = gerarAccessToken({ login: user.login });

      return res.json({ accessToken: novoAccessToken });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao renovar token.', details: error.message });
    }
  },

  async logout(req, res) {
    // Como não armazenamos refreshToken no banco, apenas responde OK
    return res.json({ message: 'Logout realizado com sucesso (sem persistência).' });
  }
};

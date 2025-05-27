const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'chave_super_secreta';

function gerarAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

function gerarRefreshToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verificarAccessToken(token) {
  return jwt.verify(token, SECRET);
}

function verificarRefreshToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  gerarAccessToken,
  gerarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken
};

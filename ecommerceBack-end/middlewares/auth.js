const { verificarAccessToken } = require('../services/jwt_service');

module.exports = (req, res, next) => {
  // Prioridade: Cookie > Authorization Header
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não encontrado' });
  }

  try {
    req.user = verificarAccessToken(token);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

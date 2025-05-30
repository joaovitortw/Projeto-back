module.exports = (...tiposPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    next();
  };
};

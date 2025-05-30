const auth = require('../middlewares/auth');
const autorizar = require('../middlewares/autorizar');
const express = require('express');
const router = express.Router();

router.get('/admin/dashboard', auth, autorizar('admin'), (req, res) => {
  res.json({ message: "Bem-vindo ao painel administrativo!" });
});

router.get('/user/dashboard', auth, autorizar('user', 'admin'), (req, res) => {
  res.json({ message: `Olá ${req.user.login}, esse é seu painel.` });
});

module.exports = router;
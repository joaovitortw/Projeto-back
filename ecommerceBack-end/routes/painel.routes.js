const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const autorizar = require('../middlewares/permission');

router.get('/admin/dashboard', auth, autorizar('admin'), (req, res) => {
  res.json({ message: "Bem-vindo ao painel administrativo!" });
});

router.get('/user/dashboard', auth, autorizar('user', 'admin'), (req, res) => {
  res.json({ message: `Olá ${req.user.username}, esse é seu painel de usuário.` });
});

module.exports = router;

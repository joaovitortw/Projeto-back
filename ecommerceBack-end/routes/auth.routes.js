const auth = require('../middlewares/auth');
const autorizar = require('../middlewares/autorizar');
const express = require('express');
const router = express.Router();

<<<<<<< HEAD
router.get('/admin/dashboard', auth, autorizar('admin'), (req, res) => {
  res.json({ message: "Bem-vindo ao painel administrativo!" });
});

router.get('/user/dashboard', auth, autorizar('user', 'admin'), (req, res) => {
  res.json({ message: `Olá ${req.user.login}, esse é seu painel.` });
});

module.exports = router;
=======
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
>>>>>>> parent of 0869932 (Autenticação, sessões e rotas organizadas)

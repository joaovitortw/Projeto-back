const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// router.get('/admin/dashboard', auth, autorizar('admin'), (req, res) => {
//   res.json({ message: "Bem-vindo ao painel administrativo!" });
// });

// router.get('/user/dashboard', auth, autorizar('user', 'admin'), (req, res) => {
//   res.json({ message: `Olá ${req.user.username}, esse é seu painel.` });
// });

module.exports = router;

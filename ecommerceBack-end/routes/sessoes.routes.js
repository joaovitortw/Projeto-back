const express = require('express');
const router = express.Router();
const { User, RefreshToken } = require('../models');
const auth = require('../middlewares/auth');

// DELETE /api/sessoes/:id
router.delete('/:id', auth, async (req, res) => {
  const sessaoId = req.params.id;

  // ID inválido
  if (isNaN(sessaoId)) {
    return res.status(400).json({ erro: 'ID de sessão inválido.' });
  }

  try {
    const token = await RefreshToken.findByPk(sessaoId);

    if (!token) {
      return res.status(404).json({ erro: 'Sessão não encontrada.' });
    }

    // Verifica se a sessão pertence ao usuário autenticado
    if (token.userId !== req.user.id) {
      return res.status(403).json({ erro: 'Sessão não pertence a este usuário.' });
    }

    await token.destroy();

    return res.status(200).json({ message: 'Sessão revogada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao revogar sessão.', detalhes: error.message });
  }
});

module.exports = router;

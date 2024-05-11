// api/routes/usuarios.js

const express = require('express');
const router = express.Router();
const { Usuario } = require('../models'); // Importe o modelo de usuário

// Rota para atualizar o perfil do usuário
router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    // Encontre o usuário pelo ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualize os campos relevantes
    usuario.nome = nome;
    usuario.login = login;
    usuario.email = email;
    usuario.senha = senha;


    // Salve as alterações
    await usuario.save();

    return res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;

const authService = require('../services/authService');

async function register(req, res) {
  try {
    const usuario = await authService.registrar(req.body);
    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function login(req, res) {
  try {
    const dados = await authService.login(req.body);
    return res.status(200).json(dados);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function resetPassword(req, res) {
  try {
    await authService.resetarSenha(req.body);
    return res.status(200).json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

module.exports = { register, login, resetPassword };

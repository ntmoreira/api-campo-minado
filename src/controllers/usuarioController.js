const usuarioService = require('../services/usuarioService');

async function getById(req, res) {
  try {
    const usuario = await usuarioService.buscarPorId(req.params.id);
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function getDashboard(req, res) {
  try {
    // Busca o id pelo query param ou pelo body para flexibilidade
    const id = req.query.id || req.body.id;
    if (!id) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }
    const stats = await usuarioService.buscarDashboard(id);
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function updateSaldo(req, res) {
  try {
    const result = await usuarioService.atualizarSaldo(req.params.id, req.body.saldo);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function deleteUser(req, res) {
  try {
    await usuarioService.deletar(req.params.id);
    return res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

module.exports = { getById, getDashboard, updateSaldo, deleteUser };

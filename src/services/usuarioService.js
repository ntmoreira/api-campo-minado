const usuarioRepository = require('../repositories/usuarioRepository');
const jogoRepository = require('../repositories/jogoRepository');

async function buscarPorId(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }
  return usuario;
}

async function buscarDashboard(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const stats = await jogoRepository.estatisticasPorUsuario(id);

  return {
    totalJogos: parseInt(stats.totalJogos),
    vitorias: parseInt(stats.vitorias),
    derrotas: parseInt(stats.derrotas),
    valorGanho: parseFloat(stats.valorGanho),
    valorPerdido: parseFloat(stats.valorPerdido),
  };
}

async function atualizarSaldo(id, saldo) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  if (saldo < 0) {
    throw { status: 400, message: 'Não é permitido cadastrar saldo negativo' };
  }

  const saldoArredondado = parseFloat(parseFloat(saldo).toFixed(2));
  return await usuarioRepository.atualizarSaldo(id, saldoArredondado);
}

async function deletar(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }
  await usuarioRepository.deletar(id);
}

module.exports = { buscarPorId, buscarDashboard, atualizarSaldo, deletar };

const jogoRepository = require('../repositories/jogoRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const { gerarTabuleiro, calcularPremio } = require('../modules/tabuleiro');

async function iniciarPartida({ idUser, valorAposta }) {
  if (!idUser || !valorAposta) {
    throw { status: 400, message: 'idUser e valorAposta são obrigatórios' };
  }

  const usuario = await usuarioRepository.buscarPorId(idUser);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const partidaEmAndamento = await jogoRepository.buscarPartidaEmAndamento(idUser);
  if (partidaEmAndamento) {
    throw { status: 400, message: 'Você já possui uma partida em andamento. Finalize-a antes de iniciar uma nova.' };
  }

  if (parseFloat(usuario.saldo) < parseFloat(valorAposta)) {
    throw { status: 400, message: 'Saldo insuficiente para realizar a aposta' };
  }

  const novoSaldo = parseFloat(usuario.saldo) - parseFloat(valorAposta);
  await usuarioRepository.atualizarSaldo(idUser, novoSaldo.toFixed(2));

  const tabuleiro = gerarTabuleiro();
  const jogo = await jogoRepository.criar({ idUsuario: idUser, tabuleiro, valorAposta });

  return { gameId: jogo.gameId };
}

async function revelarPosicao(gameId, { linha, coluna }) {
  if (linha === undefined || coluna === undefined) {
    throw { status: 400, message: 'linha e coluna são obrigatórios' };
  }

  if (linha < 0 || linha > 4 || coluna < 0 || coluna > 4) {
    throw { status: 400, message: 'Posição inválida. linha e coluna devem estar entre 0 e 4' };
  }

  const jogo = await jogoRepository.buscarPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Esta partida já foi encerrada' };
  }

  const posicoesReveladas = jogo.posicoesReveladas || [];
  const jaRevelada = posicoesReveladas.some(p => p.linha === linha && p.coluna === coluna);
  if (jaRevelada) {
    throw { status: 400, message: 'Esta posição já foi escolhida anteriormente. Escolha outra posição.' };
  }

  const tabuleiro = jogo.tabuleiro;
  const resultado = tabuleiro[linha][coluna];

  const novasPosicoesReveladas = [...posicoesReveladas, { linha, coluna }];
  let diamantesEncontrados = jogo.diamantesEncontrados;
  let status = 'EM_ANDAMENTO';
  let premioAtual = 0;

  if (resultado === 'BOMBA') {
    status = 'PERDIDO';
    premioAtual = 0;
    await jogoRepository.atualizarAposReveal({
      id: gameId,
      posicoesReveladas: novasPosicoesReveladas,
      diamantesEncontrados,
      premioAtual,
      status,
    });
    return { resultado: 'BOMBA', status: 'PERDIDO' };
  }

  // É diamante
  diamantesEncontrados += 1;
  premioAtual = calcularPremio(parseFloat(jogo.valorAposta), diamantesEncontrados);

  await jogoRepository.atualizarAposReveal({
    id: gameId,
    posicoesReveladas: novasPosicoesReveladas,
    diamantesEncontrados,
    premioAtual: premioAtual.toFixed(2),
    status,
  });

  return {
    resultado: 'DIAMANTE',
    diamantesEncontrados,
    premioAtual: parseFloat(premioAtual.toFixed(2)),
  };
}

async function cashout(gameId) {
  const jogo = await jogoRepository.buscarPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Esta partida já foi encerrada' };
  }

  if (jogo.diamantesEncontrados === 0) {
    throw { status: 400, message: 'É necessário encontrar pelo menos um diamante para realizar o cashout' };
  }

  const premioFinal = parseFloat(jogo.premioAtual);

  await jogoRepository.finalizar(gameId, premioFinal.toFixed(2));

  const usuario = await usuarioRepository.buscarPorId(jogo.idUsuario);
  const novoSaldo = parseFloat(usuario.saldo) + premioFinal;
  await usuarioRepository.atualizarSaldo(jogo.idUsuario, novoSaldo.toFixed(2));

  return {
    premioFinal: parseFloat(premioFinal.toFixed(2)),
    novoSaldo: parseFloat(novoSaldo.toFixed(2)),
  };
}

module.exports = { iniciarPartida, revelarPosicao, cashout };

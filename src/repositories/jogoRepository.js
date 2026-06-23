const pool = require('../config/database');

async function criar({ idUsuario, tabuleiro, valorAposta }) {
  const result = await pool.query(
    `INSERT INTO jogos (id_usuario, tabuleiro, valor_aposta, premio_atual, posicoes_reveladas, status)
     VALUES ($1, $2, $3, 0, '[]', 'EM_ANDAMENTO')
     RETURNING id AS "gameId"`,
    [idUsuario, JSON.stringify(tabuleiro), valorAposta]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT id, id_usuario AS "idUsuario", tabuleiro, posicoes_reveladas AS "posicoesReveladas",
            diamantes_encontrados AS "diamantesEncontrados", valor_aposta AS "valorAposta",
            premio_atual AS "premioAtual", status
     FROM jogos WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function buscarPartidaEmAndamento(idUsuario) {
  const result = await pool.query(
    `SELECT id FROM jogos WHERE id_usuario = $1 AND status = 'EM_ANDAMENTO'`,
    [idUsuario]
  );
  return result.rows[0] || null;
}

async function atualizarAposReveal({ id, posicoesReveladas, diamantesEncontrados, premioAtual, status }) {
  await pool.query(
    `UPDATE jogos
     SET posicoes_reveladas = $1,
         diamantes_encontrados = $2,
         premio_atual = $3,
         status = $4,
         finalizado_em = CASE WHEN $4 != 'EM_ANDAMENTO' THEN NOW() ELSE finalizado_em END
     WHERE id = $5`,
    [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, status, id]
  );
}

async function finalizar(id, premioFinal) {
  await pool.query(
    `UPDATE jogos SET status = 'FINALIZADO', premio_atual = $1, finalizado_em = NOW() WHERE id = $2`,
    [premioFinal, id]
  );
}

async function estatisticasPorUsuario(idUsuario) {
  const result = await pool.query(
    `SELECT
       COUNT(*) AS "totalJogos",
       COUNT(*) FILTER (WHERE status = 'FINALIZADO' AND premio_atual > valor_aposta) AS "vitorias",
       COUNT(*) FILTER (WHERE status = 'PERDIDO' OR (status = 'FINALIZADO' AND premio_atual <= valor_aposta)) AS "derrotas",
       COALESCE(SUM(premio_atual) FILTER (WHERE status = 'FINALIZADO' AND premio_atual > valor_aposta), 0) AS "valorGanho",
       COALESCE(SUM(valor_aposta) FILTER (WHERE status = 'PERDIDO'), 0) AS "valorPerdido"
     FROM jogos
     WHERE id_usuario = $1 AND status != 'EM_ANDAMENTO'`,
    [idUsuario]
  );
  return result.rows[0];
}

module.exports = {
  criar,
  buscarPorId,
  buscarPartidaEmAndamento,
  atualizarAposReveal,
  finalizar,
  estatisticasPorUsuario,
};

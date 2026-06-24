const pool = require('../config/database');

async function criar({ idUsuario, valorAposta, tabuleiro }) {
  const result = await pool.query(
    `INSERT INTO jogos (id_usuario, valor_aposta, tabuleiro, status, diamantes_encontrados, premio_atual)
     VALUES ($1, $2, $3::jsonb, 'EM_ANDAMENTO', 0, 0)
     RETURNING id AS "gameId"`,
    [idUsuario, valorAposta, JSON.stringify(tabuleiro)]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT * FROM jogos WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function buscarPartidaEmAndamento(idUsuario) {
  const result = await pool.query(
    `SELECT * FROM jogos WHERE id_usuario = $1 AND status = 'EM_ANDAMENTO'`,
    [idUsuario]
  );
  return result.rows[0];
}

async function atualizarAposReveal({ id, tabuleiro, diamantesEncontrados, premioAtual, status }) {
  const result = await pool.query(
    `UPDATE jogos
     SET tabuleiro = $1::jsonb,
         diamantes_encontrados = $2,
         premio_atual = $3,
         status = $4
     WHERE id = $5
     RETURNING *`,
    [JSON.stringify(tabuleiro), diamantesEncontrados, premioAtual, status, id]
  );
  return result.rows[0];
}

async function finalizar({ id, premioFinal }) {
  const result = await pool.query(
    `UPDATE jogos
     SET status = 'FINALIZADO', premio_atual = $1
     WHERE id = $2
     RETURNING *`,
    [premioFinal, id]
  );
  return result.rows[0];
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

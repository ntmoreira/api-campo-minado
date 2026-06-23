const pool = require('../config/database');

async function criar({ nome, email, dataNascimento, senhaHash }) {
  const result = await pool.query(
    `INSERT INTO usuarios (nome, email, data_nascimento, senha)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, data_nascimento AS "dataNascimento", saldo`,
    [nome, email, dataNascimento, senhaHash]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query(
    `SELECT id, nome, email, data_nascimento AS "dataNascimento", senha, saldo
     FROM usuarios WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT id, nome, email, data_nascimento AS "dataNascimento", saldo
     FROM usuarios WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function atualizarSenha(id, senhaHash) {
  await pool.query(
    `UPDATE usuarios SET senha = $1 WHERE id = $2`,
    [senhaHash, id]
  );
}

async function atualizarSaldo(id, saldo) {
  const result = await pool.query(
    `UPDATE usuarios SET saldo = $1 WHERE id = $2 RETURNING saldo`,
    [saldo, id]
  );
  return result.rows[0];
}

async function deletar(id) {
  await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id]);
}

async function buscarSenhaHash(id) {
  const result = await pool.query(
    `SELECT senha FROM usuarios WHERE id = $1`,
    [id]
  );
  return result.rows[0]?.senha || null;
}

module.exports = {
  criar,
  buscarPorEmail,
  buscarPorId,
  atualizarSenha,
  atualizarSaldo,
  deletar,
  buscarSenhaHash,
};

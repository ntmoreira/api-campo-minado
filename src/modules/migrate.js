const pool = require('../config/database');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        data_nascimento DATE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        saldo NUMERIC(10, 2) DEFAULT 0.00,
        criado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS jogos (
        id SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        tabuleiro JSONB NOT NULL,
        posicoes_reveladas JSONB DEFAULT '[]',
        diamantes_encontrados INTEGER DEFAULT 0,
        valor_aposta NUMERIC(10, 2) NOT NULL,
        premio_atual NUMERIC(10, 2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'EM_ANDAMENTO',
        criado_em TIMESTAMP DEFAULT NOW(),
        finalizado_em TIMESTAMP
      );
    `);
    console.log('Tabelas criadas com sucesso!');
  } finally {
    client.release();
  }
}

migrate().catch(console.error);

const jogoService = require('../services/jogoService');

async function start(req, res) {
  try {
    const { idUser, valorAposta } = req.body;
    const result = await jogoService.iniciarPartida({ idUser, valorAposta });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function reveal(req, res) {
  try {
    const { gameId } = req.params;
    const result = await jogoService.revelarPosicao(gameId, req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

async function cashout(req, res) {
  try {
    const { gameId } = req.params;
    const result = await jogoService.cashout(gameId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
  }
}

module.exports = { start, reveal, cashout };

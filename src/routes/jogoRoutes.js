const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

router.post('/start', jogoController.start);
router.post('/:gameId/reveal', jogoController.reveal);
router.post('/:gameId/cashout', jogoController.cashout);

module.exports = router;

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/dashboard', usuarioController.getDashboard);
router.get('/:id', usuarioController.getById);
router.put('/:id', usuarioController.updateSaldo);
router.delete('/:id', usuarioController.deleteUser);

module.exports = router;

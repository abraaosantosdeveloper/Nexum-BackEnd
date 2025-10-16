const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

// Rotas públicas
router.post('/', UserController.create);

// Rotas protegidas
router.get('/', authMiddleware, UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, isAdmin, UserController.delete);

module.exports = router;

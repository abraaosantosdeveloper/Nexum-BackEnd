const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleware, isGestor, isAdmin } = require('../middlewares/auth');

// Rotas especiais (devem vir antes das rotas com parâmetros)
router.get('/criticos', authMiddleware, ProductController.getCriticos);
router.get('/dashboard', authMiddleware, isGestor, ProductController.getDashboard);

// Busca por código
router.get('/codigo/:codigo', authMiddleware, ProductController.getByCodigo);

// CRUD básico
router.post('/', authMiddleware, isGestor, ProductController.create);
router.get('/', authMiddleware, ProductController.getAll);
router.get('/:id', authMiddleware, ProductController.getById);
router.put('/:id', authMiddleware, isGestor, ProductController.update);
router.delete('/:id', authMiddleware, isAdmin, ProductController.delete);

module.exports = router;

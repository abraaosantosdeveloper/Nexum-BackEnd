const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - abc
 *               - tipo
 *             properties:
 *               codigo:
 *                 type: string
 *               abc:
 *                 type: string
 *                 enum: [A, B, C]
 *               tipo:
 *                 type: integer
 *                 enum: [10, 19, 20]
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post('/', authMiddleware, [
    body('codigo').notEmpty(),
    body('abc').isIn(['A', 'B', 'C']),
    body('tipo').isIn([10, 19, 20])
], ProductController.create);

/**
 * @swagger
 * /products/{codigo}:
 *   get:
 *     summary: Buscar produto por código
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
router.get('/:codigo', authMiddleware, ProductController.getByCode);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saldo_manut:
 *                 type: integer
 *               provid_compras:
 *                 type: integer
 *               recebimento_esperado:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 */
router.put('/:id', authMiddleware, [
    body('saldo_manut').isInt(),
    body('provid_compras').isInt(),
    body('recebimento_esperado').isInt()
], ProductController.update);

/**
 * @swagger
 * /products/metrics:
 *   get:
 *     summary: Obter métricas de inventário
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas obtidas com sucesso
 */
router.get('/metrics', authMiddleware, ProductController.getMetrics);

module.exports = router;
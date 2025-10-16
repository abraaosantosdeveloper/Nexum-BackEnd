const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 */
router.post('/login', [
    body('email').isEmail(),
    body('senha').isLength({ min: 6 })
], UserController.login);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *               - matricula
 *               - nivel_acesso
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *               matricula:
 *                 type: string
 *               nivel_acesso:
 *                 type: string
 *                 enum: [admin, usuario]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', [
    body('email').isEmail(),
    body('senha').isLength({ min: 6 }),
    body('matricula').notEmpty(),
    body('nivel_acesso').isIn(['admin', 'usuario'])
], UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 format: email
 *               matricula:
 *                 type: string
 *               nivel_acesso:
 *                 type: string
 *                 enum: [admin, usuario]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.put('/:id', authMiddleware, [
    body('email').isEmail(),
    body('matricula').notEmpty(),
    body('nivel_acesso').isIn(['admin', 'usuario'])
], UserController.update);

module.exports = router;
const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');
const { validationResult } = require('express-validator');

class UserController {
    async login(req, res) {
        try {
            console.log('Recebido requisição de login:', { 
                body: req.body,
                headers: req.headers
            });

            const { email, senha } = req.body;
            
            if (!email || !senha) {
                return res.status(400).json({ 
                    error: 'Email e senha são obrigatórios',
                    received: { hasEmail: !!email, hasSenha: !!senha }
                });
            }

            const { user, token } = await AuthService.authenticate(email, senha);
            
            console.log('Login bem-sucedido:', { 
                userId: user.id,
                hasToken: !!token
            });

            return res.json({ user, token });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(401).json({ 
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await UserRepository.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await UserRepository.update(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
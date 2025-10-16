const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');
const { validationResult } = require('express-validator');

class UserController {
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const { user, token } = await AuthService.authenticate(email, senha);
            return res.json({ user, token });
        } catch (error) {
            return res.status(401).json({ error: error.message });
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
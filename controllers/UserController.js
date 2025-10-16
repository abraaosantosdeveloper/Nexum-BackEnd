const UserService = require('../services/UserService');

class UserController {
    async create(req, res) {
        try {
            console.log('📝 Dados recebidos:', req.body);
            console.log('📝 Headers:', req.headers['content-type']);
            
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Corpo da requisição vazio' });
            }

            const user = await UserService.createUser(req.body);
            console.log('✅ Usuário criado com sucesso');
            return res.status(201).json(user);
        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (error) {
            console.error('❌ Erro ao listar usuários:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            return res.json(user);
        } catch (error) {
            console.error('❌ Erro ao buscar usuário:', error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            return res.json(user);
        } catch (error) {
            console.error('❌ Erro ao atualizar usuário:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await UserService.deleteUser(req.params.id);
            return res.status(204).send();
        } catch (error) {
            console.error('❌ Erro ao deletar usuário:', error.message);
            return res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UserController();

const UserRepository = require('../repositories/UserRepository');

class UserService {
    async createUser(userData) {
        try {
            // Validar dados
            if (!userData || typeof userData !== 'object') {
                throw new Error('Dados inválidos');
            }

            if (!userData.email || !userData.senha) {
                throw new Error('Email e senha são obrigatórios');
            }

            if (!userData.nivel_acesso) {
                throw new Error('Nível de acesso é obrigatório');
            }

            // Verificar se usuário já existe
            const existingUser = await UserRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email já cadastrado');
            }

            // Criar usuário
            const user = await UserRepository.create(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await UserRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            return await UserRepository.findAll();
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, userData) {
        try {
            const user = await UserRepository.update(id, userData);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const user = await UserRepository.delete(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();

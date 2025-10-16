const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
    async authenticate(email, senha) {
        try {
            const user = await UserRepository.findByEmail(email);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            if (!user.senha) {
                throw new Error('Senha não encontrada no banco de dados');
            }

            const isValidPassword = await bcrypt.compare(senha, user.senha);
            
            if (!isValidPassword) {
                throw new Error('Senha inválida');
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    nivel_acesso: user.nivel_acesso 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Remove password from user object
            const { senha: _, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (error) {
            throw error;
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });
    }
}

module.exports = new AuthService();

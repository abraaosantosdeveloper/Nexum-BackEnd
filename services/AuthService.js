const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
    async authenticate(email, senha) {
        try {
            console.log('Tentando autenticar usuário:', { email });
            
            const user = await UserRepository.findByEmail(email);
            console.log('Usuário encontrado:', user ? { 
                id: user.id, 
                email: user.email, 
                hasPassword: !!user.senha 
            } : 'Nenhum usuário encontrado');
            
            if (!user) {
                throw new Error('User not found');
            }

            if (!user.senha) {
                throw new Error('Password hash not found in database');
            }

            const isValidPassword = await bcrypt.compare(senha, user.senha);
            
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    nivel_acesso: user.nivel_acesso 
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { user, token };
        } catch (error) {
            console.error('Authentication error:', error);
            throw new Error('Authentication failed');
        }
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserRepository.findById(decoded.id);
            
            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error('Invalid token');
        }
    }
}

module.exports = new AuthService();
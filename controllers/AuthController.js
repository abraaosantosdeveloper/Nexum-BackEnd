const AuthService = require('../services/AuthService');

class AuthController {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ 
                    error: 'Email e senha são obrigatórios' 
                });
            }

            const result = await AuthService.authenticate(email, senha);
            
            return res.json(result);
        } catch (error) {
            console.error('❌ Erro no login:', error.message);
            return res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();

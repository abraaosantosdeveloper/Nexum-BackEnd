const AuthService = require('../services/AuthService');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Erro no token' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token mal formatado' });
        }

        const decoded = AuthService.verifyToken(token);
        
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.userNivelAcesso = decoded.nivel_acesso;
        
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

function isGestor(req, res, next) {
    if (!['gestor', 'admin'].includes(req.userNivelAcesso)) {
        return res.status(403).json({ error: 'Acesso negado: apenas gestores' });
    }
    return next();
}

function isAdmin(req, res, next) {
    if (req.userNivelAcesso !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado: apenas administradores' });
    }
    return next();
}

module.exports = { authMiddleware, isGestor, isAdmin };

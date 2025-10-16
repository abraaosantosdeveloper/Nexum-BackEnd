const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    try {
        // Pegar o token do header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // O token vem no formato "Bearer token"
        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token error' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token malformatted' });
        }

        // Verificar se o token é válido
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token invalid' });
            }

            // Se tudo estiver ok, salva as informações do usuário na requisição
            req.userId = decoded.id;
            req.userEmail = decoded.email;
            req.userNivelAcesso = decoded.nivel_acesso;
            return next();
        });
    } catch (err) {
        return res.status(401).json({ error: 'Token authentication failed' });
    }
}

// Middleware para verificar se o usuário é admin
function isAdmin(req, res, next) {
    if (req.userNivelAcesso !== 'admin') {
        return res.status(403).json({ error: 'Access denied: admin only' });
    }
    return next();
}

module.exports = { authMiddleware, isAdmin };
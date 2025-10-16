const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Nexum Supply Chain API', 
        status: 'Online',
        version: '2.0.0',
        timestamp: new Date(),
        endpoints: {
            auth: '/api/auth/login',
            users: '/api/users',
            products: '/api/products'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Rota não encontrada',
        path: req.path,
        method: req.method
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    
    // Vercel serverless: garantir que req e res existem
    if (!res || !res.status) {
        console.error('Response object não disponível');
        return;
    }
    
    res.status(err.status || 500).json({ 
        error: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('� NEXUM API - Arquitetura Modular');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://127.0.0.1:${PORT}`);
    console.log('========================================');
    console.log('📂 Estrutura:');
    console.log('  ├── Models (Entidades)');
    console.log('  ├── Repositories (Acesso a dados)');
    console.log('  ├── Services (Lógica de negócio)');
    console.log('  ├── Controllers (Controle de rotas)');
    console.log('  └── Middlewares (Autenticação/Autorização)');
    console.log('========================================\n');
});

server.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
});

module.exports = app;
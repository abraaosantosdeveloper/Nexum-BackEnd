const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Basic security headers
app.use(helmet());

// Configuração do CORS
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Nexum Supply Chain API', status: 'Running' });
});

// Middleware para headers da API
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept', '*/*');
    next();
});

// Rotas da API
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 1433;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nexum Supply Chain API',
            version: '1.0.0',
            description: 'API para gerenciamento da cadeia de suprimentos',
            contact: {
                name: 'Abraão Santos',
                url: 'https://github.com/abraaosantosdeveloper'
            }
        },
        servers: [
            {
                url: 'http://localhost:1433/api',
                description: 'Development Server'
            },
            {
                url: '/api',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

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

// Configurar tipos MIME corretos para arquivos estáticos
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    } else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    } else if (req.path.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
    }
    next();
});

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customSiteTitle: "Nexum Supply Chain API Documentation",
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        persistAuthorization: true,
        urls: [
            {
                url: '/api/swagger-spec',
                name: 'API Spec'
            }
        ]
    }
}));

// Rota para servir a especificação Swagger como JSON
app.get('/api/swagger-spec', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(swaggerSpecs);
});

// Middleware para headers da API
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Rota de health check
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Rotas da API com prefixo
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Rota de health check
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Rotas da API com prefixo
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
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const helmet = require('helmet'); // Import helmet

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Set security headers with Helmet, configured for Swagger UI
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    },
  })
);

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
                url: 'https://nexum-back-end.vercel.app', // Correct production URL
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

// Simplified Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customSiteTitle: "Nexum Supply Chain API Documentation",
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        persistAuthorization: true,
    }
}));

// Rota de health check
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
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
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
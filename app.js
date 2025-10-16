const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.json'); // Import the static JSON file

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();





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

// Final Swagger UI setup with CDN
const SWAGGER_UI_VERSION = "5.17.14";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customSiteTitle: "Nexum Supply Chain API Documentation",
    customCssUrl: `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui.min.css`,
    customJs: [
        `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui-bundle.js`,
        `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.js`
    ],
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
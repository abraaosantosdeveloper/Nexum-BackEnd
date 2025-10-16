const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.json');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Configuração do CORS e Headers
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept', '*/*');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customSiteTitle: "Nexum Supply Chain API Documentation",
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true
    }
}));

// Routes with API prefix
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 1433;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

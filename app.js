const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
    return res.send(
        swaggerUi.generateHTML(swaggerDocument, {
            customSiteTitle: "Nexum Supply Chain API Documentation"
        })
    );
});

// Routes with API prefix
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 1433;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

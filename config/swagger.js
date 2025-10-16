const swaggerJsdoc = require('swagger-jsdoc');

const options = {
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
                url: '/api',
                description: 'API Server'
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
    apis: ['./routes/*.js', './controllers/*.js'], // Paths to files containing OpenAPI annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
const ProductRepository = require('../repositories/ProductRepository');
const { validationResult } = require('express-validator');

class ProductController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const product = await ProductRepository.create(req.body);
            return res.status(201).json(product);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getByCode(req, res) {
        try {
            const product = await ProductRepository.findByCodigo(req.params.codigo);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(product);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const product = await ProductRepository.update(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.json(product);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getMetrics(req, res) {
        try {
            const metrics = await ProductRepository.getInventoryMetrics();
            return res.json(metrics);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
const ProductService = require('../services/ProductService');

class ProductController {
    async create(req, res) {
        try {
            console.log('📦 Criar produto:', req.body.codigo);
            
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Corpo da requisição vazio' });
            }

            const product = await ProductService.createProduct(req.body);
            console.log('✅ Produto criado com sucesso');
            return res.status(201).json(product);
        } catch (error) {
            console.error('❌ Erro ao criar produto:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            console.log('📋 Listar produtos');
            
            // Filtros da query string
            const filters = {
                abc: req.query.abc,
                tipo: req.query.tipo,
                sem_estoque: req.query.sem_estoque === 'true',
                criticos: req.query.criticos === 'true'
            };

            const products = await ProductService.getAllProducts(filters);
            console.log(`✅ Encontrados ${products.length} produtos`);
            return res.json(products);
        } catch (error) {
            console.error('❌ Erro ao listar produtos:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            console.log('🔍 Buscar produto ID:', req.params.id);
            const product = await ProductService.getProductById(req.params.id);
            return res.json(product);
        } catch (error) {
            console.error('❌ Erro ao buscar produto:', error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    async getByCodigo(req, res) {
        try {
            console.log('🔍 Buscar produto Código:', req.params.codigo);
            const product = await ProductService.getProductByCodigo(req.params.codigo);
            return res.json(product);
        } catch (error) {
            console.error('❌ Erro ao buscar produto:', error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            console.log('✏️ Atualizar produto ID:', req.params.id);
            const product = await ProductService.updateProduct(req.params.id, req.body);
            console.log('✅ Produto atualizado com sucesso');
            return res.json(product);
        } catch (error) {
            console.error('❌ Erro ao atualizar produto:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            console.log('🗑️ Deletar produto ID:', req.params.id);
            await ProductService.deleteProduct(req.params.id);
            console.log('✅ Produto deletado com sucesso');
            return res.status(204).send();
        } catch (error) {
            console.error('❌ Erro ao deletar produto:', error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    // Endpoints especiais
    async getCriticos(req, res) {
        try {
            console.log('⚠️ Buscar produtos críticos');
            const products = await ProductService.getProdutosCriticos();
            console.log(`✅ Encontrados ${products.length} produtos críticos`);
            return res.json(products);
        } catch (error) {
            console.error('❌ Erro ao buscar produtos críticos:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getDashboard(req, res) {
        try {
            console.log('📊 Buscar dashboard executivo');
            const dashboard = await ProductService.getDashboard();
            return res.json(dashboard);
        } catch (error) {
            console.error('❌ Erro ao buscar dashboard:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();

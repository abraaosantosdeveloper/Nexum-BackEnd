const ProductRepository = require('../repositories/ProductRepository');
const Product = require('../models/Product');

class ProductService {
    async createProduct(productData) {
        try {
            // Validações
            if (!productData.codigo) {
                throw new Error('Código do produto é obrigatório');
            }

            if (!productData.abc || !Product.isValidABC(productData.abc)) {
                throw new Error('Classificação ABC inválida. Use: A, B ou C');
            }

            if (!productData.tipo || !Product.isValidTipo(productData.tipo)) {
                throw new Error('Tipo inválido. Use: 10, 19 ou 20');
            }

            // Verificar se produto já existe
            const existingProduct = await ProductRepository.findByCodigo(productData.codigo);
            if (existingProduct) {
                throw new Error('Código de produto já cadastrado');
            }

            // Criar produto
            return await ProductRepository.create(productData);
        } catch (error) {
            throw error;
        }
    }

    async getAllProducts(filters = {}) {
        try {
            return await ProductRepository.findAll(filters);
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductRepository.findById(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getProductByCodigo(codigo) {
        try {
            const product = await ProductRepository.findByCodigo(codigo);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            // Validações opcionais
            if (productData.abc && !Product.isValidABC(productData.abc)) {
                throw new Error('Classificação ABC inválida. Use: A, B ou C');
            }

            if (productData.tipo && !Product.isValidTipo(productData.tipo)) {
                throw new Error('Tipo inválido. Use: 10, 19 ou 20');
            }

            const product = await ProductRepository.update(id, productData);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductRepository.delete(id);
            if (!product) {
                throw new Error('Produto não encontrado');
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    // Métodos especiais
    async getProdutosCriticos() {
        try {
            return await ProductRepository.getProdutosCriticos();
        } catch (error) {
            throw error;
        }
    }

    async getDashboard() {
        try {
            return await ProductRepository.getDashboard();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductService();

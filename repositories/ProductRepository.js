const { poolPromise, sql } = require('../config/database');
const Product = require('../models/Product');

class ProductRepository {
    async create(productData) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('codigo', sql.NVarChar, productData.codigo)
                .input('abc', sql.Char, productData.abc)
                .input('tipo', sql.Int, productData.tipo)
                .input('saldo_manut', sql.Int, productData.saldo_manut)
                .input('provid_compras', sql.Int, productData.provid_compras)
                .input('recebimento_esperado', sql.Int, productData.recebimento_esperado)
                .query(`
                    INSERT INTO supply_chain.produtos_estoque 
                    (codigo, abc, tipo, saldo_manut, provid_compras, recebimento_esperado)
                    OUTPUT INSERTED.*
                    VALUES (@codigo, @abc, @tipo, @saldo_manut, @provid_compras, @recebimento_esperado)
                `);

            return new Product(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async findByCodigo(codigo) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('codigo', sql.NVarChar, codigo)
                .query('SELECT * FROM supply_chain.produtos_estoque WHERE codigo = @codigo');

            return result.recordset[0] ? new Product(result.recordset[0]) : null;
        } catch (error) {
            throw error;
        }
    }

    async update(id, productData) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('saldo_manut', sql.Int, productData.saldo_manut)
                .input('provid_compras', sql.Int, productData.provid_compras)
                .input('recebimento_esperado', sql.Int, productData.recebimento_esperado)
                .query(`
                    UPDATE supply_chain.produtos_estoque
                    SET saldo_manut = @saldo_manut,
                        provid_compras = @provid_compras,
                        recebimento_esperado = @recebimento_esperado
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);

            return result.recordset[0] ? new Product(result.recordset[0]) : null;
        } catch (error) {
            throw error;
        }
    }

    async getInventoryMetrics() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT 
                        SUM(saldo_manut) as total_saldo,
                        SUM(provid_compras) as total_compras,
                        SUM(recebimento_esperado) as total_esperado,
                        COUNT(*) as total_produtos
                    FROM supply_chain.produtos_estoque
                `);

            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductRepository();
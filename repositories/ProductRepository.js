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
                .input('saldo_manut', sql.Int, productData.saldo_manut || 0)
                .input('provid_compras', sql.Int, productData.provid_compras || 0)
                .input('recebimento_esperado', sql.Int, productData.recebimento_esperado || 0)
                .input('transito_manut', sql.Int, productData.transito_manut || 0)
                .input('stage_manut', sql.Int, productData.stage_manut || 0)
                .input('recepcao_manut', sql.Int, productData.recepcao_manut || 0)
                .input('pendente_ri', sql.Int, productData.pendente_ri || 0)
                .input('pecas_teste_kit', sql.Int, productData.pecas_teste_kit || 0)
                .input('pecas_teste', sql.Int, productData.pecas_teste || 0)
                .input('fornecedor_reparo', sql.Int, productData.fornecedor_reparo || 0)
                .input('laboratorio', sql.Int, productData.laboratorio || 0)
                .input('wr', sql.Int, productData.wr || 0)
                .input('wrcr', sql.Int, productData.wrcr || 0)
                .input('stage_wr', sql.Int, productData.stage_wr || 0)
                .input('cmm', sql.Decimal(10, 2), productData.cmm || 0)
                .input('coef_perda', sql.Decimal(10, 8), productData.coef_perda || 0)
                .query(`
                    INSERT INTO supply_chain.produtos_estoque (
                        codigo, abc, tipo, saldo_manut, provid_compras, recebimento_esperado,
                        transito_manut, stage_manut, recepcao_manut, pendente_ri,
                        pecas_teste_kit, pecas_teste, fornecedor_reparo, laboratorio,
                        wr, wrcr, stage_wr, cmm, coef_perda
                    )
                    OUTPUT INSERTED.*
                    VALUES (
                        @codigo, @abc, @tipo, @saldo_manut, @provid_compras, @recebimento_esperado,
                        @transito_manut, @stage_manut, @recepcao_manut, @pendente_ri,
                        @pecas_teste_kit, @pecas_teste, @fornecedor_reparo, @laboratorio,
                        @wr, @wrcr, @stage_wr, @cmm, @coef_perda
                    )
                `);

            return new Product(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async findAll(filters = {}) {
        try {
            const pool = await poolPromise;
            let query = 'SELECT * FROM supply_chain.produtos_estoque WHERE ativo = 1';
            const request = pool.request();

            // Filtros opcionais
            if (filters.abc) {
                query += ' AND abc = @abc';
                request.input('abc', sql.Char, filters.abc);
            }

            if (filters.tipo) {
                query += ' AND tipo = @tipo';
                request.input('tipo', sql.Int, filters.tipo);
            }

            if (filters.sem_estoque) {
                query += ' AND saldo_manut = 0';
            }

            if (filters.criticos) {
                query += ' AND cmm > 1 AND saldo_manut = 0';
            }

            query += ' ORDER BY data_atualizacao DESC';

            const result = await request.query(query);
            return result.recordset.map(product => new Product(product));
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM supply_chain.produtos_estoque WHERE id = @id AND ativo = 1');

            if (!result.recordset[0]) return null;
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
                .query('SELECT * FROM supply_chain.produtos_estoque WHERE codigo = @codigo AND ativo = 1');

            if (!result.recordset[0]) return null;
            return new Product(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async update(id, productData) {
        try {
            const pool = await poolPromise;
            const updateFields = [];
            const request = pool.request().input('id', sql.Int, id);

            // Campos atualizáveis
            const updatableFields = [
                'codigo', 'abc', 'tipo', 'saldo_manut', 'provid_compras', 'recebimento_esperado',
                'transito_manut', 'stage_manut', 'recepcao_manut', 'pendente_ri',
                'pecas_teste_kit', 'pecas_teste', 'fornecedor_reparo', 'laboratorio',
                'wr', 'wrcr', 'stage_wr', 'cmm', 'coef_perda'
            ];

            updatableFields.forEach(field => {
                if (productData[field] !== undefined) {
                    updateFields.push(`${field} = @${field}`);
                    
                    // Definir tipo SQL apropriado
                    if (field === 'codigo') {
                        request.input(field, sql.NVarChar, productData[field]);
                    } else if (field === 'abc') {
                        request.input(field, sql.Char, productData[field]);
                    } else if (field === 'tipo') {
                        request.input(field, sql.Int, productData[field]);
                    } else if (field === 'cmm') {
                        request.input(field, sql.Decimal(10, 2), productData[field]);
                    } else if (field === 'coef_perda') {
                        request.input(field, sql.Decimal(10, 8), productData[field]);
                    } else {
                        request.input(field, sql.Int, productData[field]);
                    }
                }
            });

            if (updateFields.length === 0) {
                throw new Error('Nenhum campo para atualizar');
            }

            const result = await request.query(`
                UPDATE supply_chain.produtos_estoque 
                SET ${updateFields.join(', ')}
                OUTPUT INSERTED.*
                WHERE id = @id AND ativo = 1
            `);

            if (!result.recordset[0]) return null;
            return new Product(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE supply_chain.produtos_estoque 
                    SET ativo = 0
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);

            if (!result.recordset[0]) return null;
            return new Product(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    // Métodos especiais para relatórios
    async getProdutosCriticos() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query('SELECT * FROM supply_chain.vw_produtos_criticos ORDER BY cmm DESC');

            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    async getDashboard() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query('SELECT * FROM supply_chain.vw_dashboard_executivo');

            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProductRepository();

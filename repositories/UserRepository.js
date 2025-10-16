const { poolPromise, sql } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserRepository {
    async create(userData) {
        try {
            const pool = await poolPromise;
            const hashedPassword = await bcrypt.hash(userData.senha, 10);
            
            const result = await pool.request()
                .input('email', sql.NVarChar, userData.email)
                .input('senha', sql.NVarChar, hashedPassword)
                .input('matricula', sql.NVarChar, userData.matricula || null)
                .input('nivel_acesso', sql.NVarChar, userData.nivel_acesso)
                .query(`
                    INSERT INTO supply_chain.usuarios (email, senha, matricula, nivel_acesso)
                    OUTPUT INSERTED.*
                    VALUES (@email, @senha, @matricula, @nivel_acesso)
                `);

            return new User(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query(`
                    SELECT id, email, senha, matricula, nivel_acesso, 
                           data_criacao, data_atualizacao 
                    FROM supply_chain.usuarios 
                    WHERE email = @email
                `);

            if (!result.recordset[0]) return null;
            
            return new User(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT id, email, senha, matricula, nivel_acesso, 
                           data_criacao, data_atualizacao 
                    FROM supply_chain.usuarios 
                    WHERE id = @id
                `);

            if (!result.recordset[0]) return null;
            
            return new User(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT id, email, matricula, nivel_acesso, 
                           data_criacao, data_atualizacao 
                    FROM supply_chain.usuarios
                    ORDER BY data_criacao DESC
                `);

            return result.recordset.map(user => new User(user));
        } catch (error) {
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const pool = await poolPromise;
            const updateFields = [];
            const request = pool.request().input('id', sql.Int, id);

            if (userData.email) {
                updateFields.push('email = @email');
                request.input('email', sql.NVarChar, userData.email);
            }

            if (userData.senha) {
                const hashedPassword = await bcrypt.hash(userData.senha, 10);
                updateFields.push('senha = @senha');
                request.input('senha', sql.NVarChar, hashedPassword);
            }

            if (userData.matricula) {
                updateFields.push('matricula = @matricula');
                request.input('matricula', sql.NVarChar, userData.matricula);
            }

            if (userData.nivel_acesso) {
                updateFields.push('nivel_acesso = @nivel_acesso');
                request.input('nivel_acesso', sql.NVarChar, userData.nivel_acesso);
            }

            updateFields.push('data_atualizacao = GETDATE()');

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            const result = await request.query(`
                UPDATE supply_chain.usuarios 
                SET ${updateFields.join(', ')}
                OUTPUT INSERTED.*
                WHERE id = @id
            `);

            if (!result.recordset[0]) return null;
            
            return new User(result.recordset[0]);
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
                    DELETE FROM supply_chain.usuarios 
                    OUTPUT DELETED.*
                    WHERE id = @id
                `);

            if (!result.recordset[0]) return null;
            
            return new User(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();

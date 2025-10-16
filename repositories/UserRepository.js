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
            
            // Log para debug
            console.log('User found:', {
                ...result.recordset[0],
                senha: result.recordset[0].senha ? 'HASH_EXISTS' : 'NO_HASH'
            });
            
            return new User(result.recordset[0]);
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM supply_chain.usuarios WHERE id = @id');

            return result.recordset[0] ? new User(result.recordset[0]) : null;
        } catch (error) {
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('email', sql.NVarChar, userData.email)
                .input('matricula', sql.NVarChar, userData.matricula)
                .input('nivel_acesso', sql.NVarChar, userData.nivel_acesso)
                .query(`
                    UPDATE supply_chain.usuarios
                    SET email = @email,
                        matricula = @matricula,
                        nivel_acesso = @nivel_acesso,
                        data_atualizacao = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);

            return result.recordset[0] ? new User(result.recordset[0]) : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
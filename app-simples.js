const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolPromise, sql } = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// ROTA DE TESTE
app.get('/test', (req, res) => {
    res.json({ message: 'API funcionando!', timestamp: new Date() });
});

// CRIAR USUÁRIO (SEM BCRYPT POR ENQUANTO)
app.post('/api/users', async (req, res) => {
    try {
        console.log('Recebido:', req.body);
        const { email, senha, matricula, nivel_acesso } = req.body;
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('senha', sql.NVarChar, senha) // SEM HASH por enquanto
            .input('matricula', sql.NVarChar, matricula)
            .input('nivel_acesso', sql.NVarChar, nivel_acesso)
            .query(`
                INSERT INTO supply_chain.usuarios (email, senha, matricula, nivel_acesso)
                OUTPUT INSERTED.*
                VALUES (@email, @senha, @matricula, @nivel_acesso)
            `);

        console.log('Usuário criado:', result.recordset[0]);
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: error.message });
    }
});

// LISTAR USUÁRIOS
app.get('/api/users', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, email, matricula, nivel_acesso, data_criacao FROM supply_chain.usuarios');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: error.message });
    }
});

// LISTAR PRODUTOS
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM supply_chain.produtos_estoque');
        
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 SERVIDOR EMERGÊNCIA RODANDO!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 Teste: http://localhost:${PORT}/test`);
    console.log('========================================');
});

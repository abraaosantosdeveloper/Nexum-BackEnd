const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { poolPromise, sql } = require('./config/database');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: 'Nexum API Online!', 
        timestamp: new Date(),
        endpoints: ['/api/users', '/api/auth/login', '/api/products']
    });
});

// ==================== ROTAS DE USUÁRIOS ====================

// CRIAR USUÁRIO
app.post('/api/users', async (req, res) => {
    try {
        console.log('📝 Criar usuário:', req.body);
        const { email, senha, matricula, nivel_acesso } = req.body;
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('senha', sql.NVarChar, hashedPassword)
            .input('matricula', sql.NVarChar, matricula || null)
            .input('nivel_acesso', sql.NVarChar, nivel_acesso)
            .query(`
                INSERT INTO supply_chain.usuarios (email, senha, matricula, nivel_acesso)
                OUTPUT INSERTED.id, INSERTED.email, INSERTED.matricula, INSERTED.nivel_acesso, INSERTED.data_criacao
                VALUES (@email, @senha, @matricula, @nivel_acesso)
            `);

        console.log('✅ Usuário criado:', result.recordset[0]);
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// LISTAR USUÁRIOS
app.get('/api/users', async (req, res) => {
    try {
        console.log('📋 Listar usuários');
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, email, matricula, nivel_acesso, data_criacao FROM supply_chain.usuarios');
        
        console.log(`✅ Encontrados ${result.recordset.length} usuários`);
        res.json(result.recordset);
    } catch (error) {
        console.error('❌ Erro ao listar usuários:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔐 Login:', req.body.email);
        const { email, senha } = req.body;
        
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM supply_chain.usuarios WHERE email = @email');

        if (result.recordset.length === 0) {
            console.log('❌ Usuário não encontrado');
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const user = result.recordset[0];
        const isValidPassword = await bcrypt.compare(senha, user.senha);

        if (!isValidPassword) {
            console.log('❌ Senha inválida');
            return res.status(401).json({ error: 'Senha inválida' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, nivel_acesso: user.nivel_acesso },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const { senha: _, ...userWithoutPassword } = user;
        console.log('✅ Login bem-sucedido');
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROTAS DE PRODUTOS ====================

app.get('/api/products', async (req, res) => {
    try {
        console.log('📦 Listar produtos');
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM supply_chain.produtos_estoque');
        
        console.log(`✅ Encontrados ${result.recordset.length} produtos`);
        res.json(result.recordset);
    } catch (error) {
        console.error('❌ Erro ao listar produtos:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ==================== SERVIDOR ====================

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('🚀 NEXUM API RODANDO!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://127.0.0.1:${PORT}`);
    console.log('========================================\n');
});

server.on('error', (error) => {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
});
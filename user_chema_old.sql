-- ============================================================================
-- CRIAÇÃO DE TABELA DE USUÁRIOS - NEXUM SUPPLY CHAIN
-- Database: stefanini_app
-- Schema: supply_chain
-- Criado em: 2025-10-15
-- ============================================================================

-- Usar o database correto
USE [stefanini_app];
GO

-- ============================================================================
-- TABELA: usuarios
-- Armazena dados de usuários do sistema (simplificado)
-- ============================================================================
IF OBJECT_ID('supply_chain.usuarios', 'U') IS NOT NULL
    DROP TABLE supply_chain.usuarios
GO

CREATE TABLE supply_chain.usuarios (
    -- Chave primária
    id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Credenciais
    email NVARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,  -- Hash bcrypt (usa 60 chars, mas 255 dá margem de segurança)
    
    -- Dados profissionais
    matricula NVARCHAR(50) NOT NULL UNIQUE,
    nivel_acesso NVARCHAR(50) NOT NULL,  -- Ex: 'planejador', 'comprador', 'fiscal', 'gestor'
    
    -- Auditoria básica
    data_criacao DATETIME2 NOT NULL DEFAULT GETDATE(),
    data_atualizacao DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_usuarios_nivel_acesso CHECK (nivel_acesso IN ('planejador', 'comprador', 'fiscal', 'gestor')),
    CONSTRAINT CK_usuarios_email_valido CHECK (email LIKE '%_@__%.__%')
)
GO

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índice para login (email é único e mais usado)
CREATE NONCLUSTERED INDEX IX_usuarios_email 
ON supply_chain.usuarios(email)
GO

-- Índice para busca por matrícula
CREATE NONCLUSTERED INDEX IX_usuarios_matricula 
ON supply_chain.usuarios(matricula)
GO

-- Índice para busca por nível de acesso
CREATE NONCLUSTERED INDEX IX_usuarios_nivel_acesso 
ON supply_chain.usuarios(nivel_acesso)
INCLUDE (email, matricula)
GO

-- ============================================================================
-- TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA
-- ============================================================================
CREATE OR ALTER TRIGGER supply_chain.TR_usuarios_update
ON supply_chain.usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE supply_chain.usuarios
    SET data_atualizacao = GETDATE()
    FROM supply_chain.usuarios u
    INNER JOIN inserted i ON u.id = i.id
END
GO

-- ============================================================================
-- VIEW: Usuários Ativos (sem senha)
-- ============================================================================
CREATE OR ALTER VIEW supply_chain.vw_usuarios_ativos
AS
SELECT 
    id,
    email,
    matricula,
    nivel_acesso,
    data_criacao,
    data_atualizacao
FROM supply_chain.usuarios
GO

-- ============================================================================
-- VIEW: Dashboard de Usuários
-- ============================================================================
CREATE OR ALTER VIEW supply_chain.vw_dashboard_usuarios
AS
SELECT 
    COUNT(*) AS total_usuarios,
    COUNT(DISTINCT nivel_acesso) AS total_niveis_acesso,
    MAX(data_criacao) AS ultimo_cadastro
FROM supply_chain.usuarios
GO

-- ============================================================================
-- VIEW: Usuários por Nível de Acesso
-- ============================================================================
CREATE OR ALTER VIEW supply_chain.vw_usuarios_por_nivel
AS
SELECT 
    nivel_acesso,
    COUNT(*) AS total
FROM supply_chain.usuarios
GROUP BY nivel_acesso
GO

-- ============================================================================
-- STORED PROCEDURE: Criar Usuário
-- ============================================================================
CREATE OR ALTER PROCEDURE supply_chain.sp_criar_usuario
    @email NVARCHAR(255),
    @senha NVARCHAR(255),
    @matricula NVARCHAR(50),
    @nivel_acesso NVARCHAR(50),
    @usuario_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar se matrícula já existe
        IF EXISTS (SELECT 1 FROM supply_chain.usuarios WHERE matricula = @matricula)
        BEGIN
            RAISERROR('Matrícula já cadastrada no sistema.', 16, 1);
            RETURN;
        END
        
        -- Validar se email já existe
        IF EXISTS (SELECT 1 FROM supply_chain.usuarios WHERE email = @email)
        BEGIN
            RAISERROR('Email já cadastrado no sistema.', 16, 1);
            RETURN;
        END
        
        -- Inserir usuário
        INSERT INTO supply_chain.usuarios (
            email, senha, matricula, nivel_acesso
        )
        VALUES (
            @email, @senha, @matricula, @nivel_acesso
        );
        
        SET @usuario_id = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        -- Retornar dados do usuário criado (sem senha)
        SELECT 
            id, email, matricula, nivel_acesso, data_criacao
        FROM supply_chain.usuarios
        WHERE id = @usuario_id;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END
GO

-- ============================================================================
-- STORED PROCEDURE: Autenticar Usuário
-- ============================================================================
CREATE OR ALTER PROCEDURE supply_chain.sp_autenticar_usuario
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        id,
        email,
        senha,  -- Hash para verificação no backend
        matricula,
        nivel_acesso
    FROM supply_chain.usuarios
    WHERE email = @email;
END
GO

-- ============================================================================
-- STORED PROCEDURE: Alterar Senha
-- ============================================================================
CREATE OR ALTER PROCEDURE supply_chain.sp_alterar_senha
    @usuario_id INT,
    @nova_senha_hash NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE supply_chain.usuarios
    SET senha = @nova_senha_hash
    WHERE id = @usuario_id;
    
    SELECT 'Senha alterada com sucesso' AS mensagem;
END
GO

-- ============================================================================
-- STORED PROCEDURE: Buscar Usuário por Matrícula
-- ============================================================================
CREATE OR ALTER PROCEDURE supply_chain.sp_buscar_usuario_por_matricula
    @matricula NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        id,
        email,
        matricula,
        nivel_acesso,
        data_criacao,
        data_atualizacao
    FROM supply_chain.usuarios
    WHERE matricula = @matricula;
END
GO

-- ============================================================================
-- COMENTÁRIOS NA TABELA
-- ============================================================================
EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Tabela de usuários do sistema Nexum Supply Chain', 
    @level0type = N'SCHEMA', @level0name = 'supply_chain',
    @level1type = N'TABLE',  @level1name = 'usuarios'
GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Senha hasheada com bcrypt (nunca armazenar senha em texto plano)', 
    @level0type = N'SCHEMA', @level0name = 'supply_chain',
    @level1type = N'TABLE',  @level1name = 'usuarios',
    @level2type = N'COLUMN', @level2name = 'senha'
GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Matrícula única do usuário', 
    @level0type = N'SCHEMA', @level0name = 'supply_chain',
    @level1type = N'TABLE',  @level1name = 'usuarios',
    @level2type = N'COLUMN', @level2name = 'matricula'
GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Nível de acesso: planejador, comprador, fiscal, gestor', 
    @level0type = N'SCHEMA', @level0name = 'supply_chain',
    @level1type = N'TABLE',  @level1name = 'usuarios',
    @level2type = N'COLUMN', @level2name = 'nivel_acesso'
GO

-- ============================================================================
-- INSERIR USUÁRIO GESTOR PADRÃO
-- Senha: Admin@123 (trocar em produção!)
-- Hash bcrypt gerado e validado corretamente
-- ============================================================================
INSERT INTO supply_chain.usuarios (
    email, senha, matricula, nivel_acesso
)
VALUES (
    'admin@nexum.com',
    '$2b$12$zyfTfB3xzEqp/8iU.wxKWOV.ZIStyWSE8dfgf4V3vrv5RnU/hg45.',
    'ADM001',
    'gestor'
);
GO

-- ============================================================================
PRINT '✅ Tabela supply_chain.usuarios criada com sucesso!'
PRINT '✅ Índices criados com sucesso!'
PRINT '✅ Trigger de auditoria criado com sucesso!'
PRINT '✅ Views criadas com sucesso!'
PRINT '✅ Stored Procedures criadas com sucesso!'
PRINT '✅ Usuário gestor padrão criado!'
PRINT ''
PRINT '📧 Login padrão: admin@nexum.com'
PRINT '🔑 Senha padrão: Admin@123'
PRINT '🆔 Matrícula padrão: ADM001'
PRINT '👤 Nível de acesso: gestor'
PRINT '⚠️  IMPORTANTE: Trocar a senha em produção!'
PRINT ''
PRINT '📊 Estrutura simplificada:'
PRINT '   - email (único)'
PRINT '   - senha (bcrypt hash validado)'
PRINT '   - matricula (único)'
PRINT '   - nivel_acesso (planejador, comprador, fiscal, gestor)'
PRINT ''
PRINT '📊 Níveis de acesso disponíveis:'
PRINT '   • planejador - Planejamento de produção e estoque'
PRINT '   • comprador  - Gestão de compras e fornecedores'
PRINT '   • fiscal     - Fiscalização e controle de qualidade'
PRINT '   • gestor     - Gestão geral do sistema (acesso completo)'
PRINT ''
PRINT '📊 Estrutura de usuários pronta para uso!'
-- ============================================================================
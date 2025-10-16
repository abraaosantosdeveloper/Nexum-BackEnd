# TESTE DA API - PASSO A PASSO

## URL Base (Local)
```
http://localhost:3000
```

## URL Base (Produção)
```
https://nexum-back-fdi5642ux-abraao-santos-projects.vercel.app
```

---

## 1. CRIAR USUÁRIO

### Método: POST
### URL: `/api/users`
### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
    "email": "admin@teste.com",
    "senha": "123456",
    "nivel_acesso": "ADMIN",
    "matricula": "ADM001"
}
```

### Resposta Esperada (201):
```json
{
    "id": 1,
    "email": "admin@teste.com",
    "nivel_acesso": "ADMIN",
    "matricula": "ADM001"
}
```

---

## 2. FAZER LOGIN

### Método: POST
### URL: `/api/auth/login`
### Headers:
```
Content-Type: application/json
```

### Body (raw JSON):
```json
{
    "email": "admin@teste.com",
    "senha": "123456"
}
```

### Resposta Esperada (200):
```json
{
    "user": {
        "id": 1,
        "email": "admin@teste.com",
        "nivel_acesso": "ADMIN",
        "matricula": "ADM001"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**COPIE O TOKEN DA RESPOSTA!**

---

## 3. LISTAR USUÁRIOS (COM AUTENTICAÇÃO)

### Método: GET
### URL: `/api/users`
### Headers:
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

### Resposta Esperada (200):
```json
[
    {
        "id": 1,
        "email": "admin@teste.com",
        "nivel_acesso": "ADMIN",
        "matricula": "ADM001",
        "data_criacao": "2025-10-16T..."
    }
]
```

---

## POSSÍVEIS ERROS

### Erro: "User not found" ou "Invalid password"
- Verifique se o usuário foi criado
- Verifique se a senha está correta

### Erro: "No token provided"
- Adicione o header Authorization com Bearer + token

### Erro: "Token invalid"
- O token expirou ou está incorreto
- Faça login novamente

### Erro: 500 Internal Server Error
- Verifique se o banco de dados está acessível
- Verifique as variáveis de ambiente (.env)

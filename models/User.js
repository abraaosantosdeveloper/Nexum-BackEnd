class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.senha = data.senha; // Adicionando senha
        this.matricula = data.matricula;
        this.nivel_acesso = data.nivel_acesso;
        this.data_criacao = data.data_criacao;
        this.data_atualizacao = data.data_atualizacao;
    }

    // Remove sensitive data for JSON responses
    toJSON() {
        const { senha, ...user } = this;
        return user;
    }
}

module.exports = User;
class Product {
    constructor(data) {
        // Identificação
        this.id = data.id;
        this.codigo = data.codigo;
        
        // Classificação
        this.abc = data.abc;
        this.tipo = data.tipo;
        
        // Estoque e compras
        this.saldo_manut = data.saldo_manut || 0;
        this.provid_compras = data.provid_compras || 0;
        this.recebimento_esperado = data.recebimento_esperado || 0;
        
        // Movimentações e localização
        this.transito_manut = data.transito_manut || 0;
        this.stage_manut = data.stage_manut || 0;
        this.recepcao_manut = data.recepcao_manut || 0;
        this.pendente_ri = data.pendente_ri || 0;
        
        // Testes e qualidade
        this.pecas_teste_kit = data.pecas_teste_kit || 0;
        this.pecas_teste = data.pecas_teste || 0;
        
        // Reparos
        this.fornecedor_reparo = data.fornecedor_reparo || 0;
        this.laboratorio = data.laboratorio || 0;
        
        // Work Requests
        this.wr = data.wr || 0;
        this.wrcr = data.wrcr || 0;
        this.stage_wr = data.stage_wr || 0;
        
        // Métricas e KPIs
        this.cmm = data.cmm || 0;
        this.coef_perda = data.coef_perda || 0;
        
        // Auditoria
        this.data_criacao = data.data_criacao;
        this.data_atualizacao = data.data_atualizacao;
        this.usuario_criacao = data.usuario_criacao;
        this.usuario_atualizacao = data.usuario_atualizacao;
        this.ativo = data.ativo !== undefined ? data.ativo : true;
    }

    // Validações
    static isValidABC(abc) {
        return ['A', 'B', 'C'].includes(abc);
    }

    static isValidTipo(tipo) {
        return [10, 19, 20].includes(parseInt(tipo));
    }

    // Cálculo de criticidade
    getNivelCriticidade() {
        if (this.cmm > 100 && this.saldo_manut === 0) return 'CRÍTICO';
        if (this.cmm > 50 && this.saldo_manut === 0) return 'ALTO';
        if (this.cmm > 10 && this.saldo_manut === 0) return 'MÉDIO';
        if (this.cmm > 1 && this.saldo_manut === 0) return 'BAIXO';
        return 'OK';
    }

    // Cálculo de necessidade de compra
    getNecessidadeCompra() {
        return Math.max(0, 
            (this.cmm * 2) - 
            this.saldo_manut - 
            this.provid_compras - 
            this.transito_manut - 
            this.recebimento_esperado
        );
    }

    // JSON com dados calculados
    toJSON() {
        return {
            ...this,
            nivel_criticidade: this.getNivelCriticidade(),
            necessidade_compra: this.getNecessidadeCompra()
        };
    }
}

module.exports = Product;

class Product {
    constructor(data) {
        this.id = data.id;
        this.codigo = data.codigo;
        this.abc = data.abc;
        this.tipo = data.tipo;
        this.saldo_manut = data.saldo_manut;
        this.provid_compras = data.provid_compras;
        this.recebimento_esperado = data.recebimento_esperado;
        this.transito_manut = data.transito_manut;
        this.stage_manut = data.stage_manut;
        this.recepcao_manut = data.recepcao_manut;
        this.pendente_ri = data.pendente_ri;
        this.pecas_teste_kit = data.pecas_teste_kit;
        this.pecas_teste = data.pecas_teste;
        this.fornecedor_reparo = data.fornecedor_reparo;
        this.laboratorio = data.laboratorio;
        this.wr = data.wr;
        this.wrcr = data.wrcr;
        this.stage_wr = data.stage_wr;
        this.cmm = data.cmm;
        this.coef_perda = data.coef_perda;
    }
}

module.exports = Product;
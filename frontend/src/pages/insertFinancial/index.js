import React, { useState } from 'react';
import axios from 'axios';

const InserirFinanceiroPage = () => {
    const [form, setForm] = useState({
        data_transacao: '',
        preco_unitario: '',
        qtd_comprada: '',
        preco_total: '',
        nome_produto: '',
        marca_produto: '',
        categoria_produto: '',
        descricao_produto: '',
        faturamento_produto: '',
        lucro_produto: '',
        cnpj_fornecedor: '',
        nome_fornecedor: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/financeiro', form);
            alert('Dados financeiros criados com sucesso!');
            setForm({
                data_transacao: '',
                preco_unitario: '',
                qtd_comprada: '',
                preco_total: '',
                nome_produto: '',
                marca_produto: '',
                categoria_produto: '',
                descricao_produto: '',
                faturamento_produto: '',
                lucro_produto: '',
                cnpj_fornecedor: '',
                nome_fornecedor: '',
            });
        } catch (error) {
            console.error('Erro ao criar os dados financeiros:', error);
            alert('Erro ao criar os dados financeiros. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>
            <h1>Inserir Dados Financeiros</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="data_transacao"
                    value={form.data_transacao}
                    onChange={handleInputChange}
                    placeholder="Data da Transação"
                />
                <input
                    type="number"
                    name="preco_unitario"
                    value={form.preco_unitario}
                    onChange={handleInputChange}
                    placeholder="Preço Unitário"
                    step="0.01"
                />
                <input
                    type="number"
                    name="qtd_comprada"
                    value={form.qtd_comprada}
                    onChange={handleInputChange}
                    placeholder="Quantidade Comprada"
                />
                <input
                    type="number"
                    name="preco_total"
                    value={form.preco_total}
                    onChange={handleInputChange}
                    placeholder="Preço Total"
                    step="0.01"
                />
                <input
                    type="text"
                    name="nome_produto"
                    value={form.nome_produto}
                    onChange={handleInputChange}
                    placeholder="Nome do Produto"
                />
                <input
                    type="text"
                    name="marca_produto"
                    value={form.marca_produto}
                    onChange={handleInputChange}
                    placeholder="Marca do Produto"
                />
                <input
                    type="text"
                    name="categoria_produto"
                    value={form.categoria_produto}
                    onChange={handleInputChange}
                    placeholder="Categoria do Produto"
                />
                <input
                    type="text"
                    name="descricao_produto"
                    value={form.descricao_produto}
                    onChange={handleInputChange}
                    placeholder="Descrição do Produto"
                />
                <input
                    type="number"
                    name="faturamento_produto"
                    value={form.faturamento_produto}
                    onChange={handleInputChange}
                    placeholder="Faturamento do Produto"
                    step="0.01"
                />
                <input
                    type="number"
                    name="lucro_produto"
                    value={form.lucro_produto}
                    onChange={handleInputChange}
                    placeholder="Lucro do Produto"
                    step="0.01"
                />
                <input
                    type="text"
                    name="cnpj_fornecedor"
                    value={form.cnpj_fornecedor}
                    onChange={handleInputChange}
                    placeholder="CNPJ do Fornecedor"
                />
                <input
                    type="text"
                    name="nome_fornecedor"
                    value={form.nome_fornecedor}
                    onChange={handleInputChange}
                    placeholder="Nome do Fornecedor"
                />
                <button type="submit">Adicionar Dados Financeiros</button>
            </form>
        </div>
    );
};

export default InserirFinanceiroPage;

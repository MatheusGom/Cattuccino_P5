import React, { useState } from 'react';
import axios from 'axios';

const InserirUsuarioPage = () => {
    const [form, setForm] = useState({
        NOME: '',
        EMAIL: '',
        SENHA: '',
        IDADE: '',
        LOCALIZACAO: '',
        TIPO_SANGUINEO: '',
        FORMACAO: '',
        DT_NASCIMENTO: '',
        COR: '',
        GENERO: '',
        DT_ADMISSAO: '',
        EXTROVERTID: '',
        CRIATIV: '',
        OCUPAD: '',
        ORGANIZAD: '',
        TRANQUIL: '',
        GERENCIA: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/usuarios', form);
            alert('Usuário criado com sucesso!');
            setForm({
                NOME: '',
                EMAIL: '',
                SENHA: '',
                IDADE: '',
                LOCALIZACAO: '',
                TIPO_SANGUINEO: '',
                FORMACAO: '',
                DT_NASCIMENTO: '',
                COR: '',
                GENERO: '',
                DT_ADMISSAO: '',
                EXTROVERTID: '',
                CRIATIV: '',
                OCUPAD: '',
                ORGANIZAD: '',
                TRANQUIL: '',
                GERENCIA: '',
            });
        } catch (error) {
            console.error('Erro ao criar o usuário:', error);
            alert('Erro ao criar o usuário. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>
            <h1>Inserir Novo Usuário</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="NOME"
                    value={form.NOME}
                    onChange={handleInputChange}
                    placeholder="Nome"
                />
                <input
                    type="text"
                    name="EMAIL"
                    value={form.EMAIL}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="SENHA"
                    value={form.SENHA}
                    onChange={handleInputChange}
                    placeholder="Senha"
                />
                <input
                    type="number"
                    name="IDADE"
                    value={form.IDADE}
                    onChange={handleInputChange}
                    placeholder="Idade"
                />
                <input
                    type="text"
                    name="LOCALIZACAO"
                    value={form.LOCALIZACAO}
                    onChange={handleInputChange}
                    placeholder="Localização"
                />
                <input
                    type="text"
                    name="TIPO_SANGUINEO"
                    value={form.TIPO_SANGUINEO}
                    onChange={handleInputChange}
                    placeholder="Tipo Sanguíneo"
                />
                <input
                    type="text"
                    name="FORMACAO"
                    value={form.FORMACAO}
                    onChange={handleInputChange}
                    placeholder="Formação"
                />
                <input
                    type="date"
                    name="DT_NASCIMENTO"
                    value={form.DT_NASCIMENTO}
                    onChange={handleInputChange}
                    placeholder="Data de Nascimento"
                />
                <input
                    type="text"
                    name="COR"
                    value={form.COR}
                    onChange={handleInputChange}
                    placeholder="Cor"
                />
                <input
                    type="text"
                    name="GENERO"
                    value={form.GENERO}
                    onChange={handleInputChange}
                    placeholder="Gênero"
                />
                <input
                    type="date"
                    name="DT_ADMISSAO"
                    value={form.DT_ADMISSAO}
                    onChange={handleInputChange}
                    placeholder="Data de Admissão"
                />
                <input
                    type="number"
                    name="EXTROVERTID"
                    value={form.EXTROVERTID}
                    onChange={handleInputChange}
                    placeholder="Extrovertido"
                />
                <input
                    type="number"
                    name="CRIATIV"
                    value={form.CRIATIV}
                    onChange={handleInputChange}
                    placeholder="Criativo"
                />
                <input
                    type="number"
                    name="OCUPAD"
                    value={form.OCUPAD}
                    onChange={handleInputChange}
                    placeholder="Ocupado"
                />
                <input
                    type="number"
                    name="ORGANIZAD"
                    value={form.ORGANIZAD}
                    onChange={handleInputChange}
                    placeholder="Organizado"
                />
                <input
                    type="number"
                    name="TRANQUIL"
                    value={form.TRANQUIL}
                    onChange={handleInputChange}
                    placeholder="Tranquilo"
                />
                <input
                    type="number"
                    name="GERENCIA"
                    value={form.GERENCIA}
                    onChange={handleInputChange}
                    placeholder="Gerência"
                />
                <button type="submit">Adicionar Usuário</button>
            </form>
        </div>
    );
};

export default InserirUsuarioPage;

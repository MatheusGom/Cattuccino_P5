import React, { useState } from 'react';
import axios from 'axios';

const InserirMarketingPage = () => {
    const [form, setForm] = useState({
        data_id: '',
        dia_semana: '',
        horario_pico: '',
        gatos_adotados: '',
        faturamento_diario: '',
        alcance_instagram: '',
        alcance_facebook: '',
        alcance_tiktok: '',
        idade_instagram: '',
        idade_facebook: '',
        idade_tiktok: '',
        qtd_clientes: '',
        maioria_sexo: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/marketing', form);
            alert('Dados de marketing criados com sucesso!');
            setForm({
                data_id: '',
                dia_semana: '',
                horario_pico: '',
                gatos_adotados: '',
                faturamento_diario: '',
                alcance_instagram: '',
                alcance_facebook: '',
                alcance_tiktok: '',
                idade_instagram: '',
                idade_facebook: '',
                idade_tiktok: '',
                qtd_clientes: '',
                maioria_sexo: '',
            });
        } catch (error) {
            console.error('Erro ao criar os dados de marketing:', error);
            alert('Erro ao criar os dados de marketing. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div>
            <h1>Inserir Dados de Marketing</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="data_id"
                    value={form.data_id}
                    onChange={handleInputChange}
                    placeholder="Data"
                />
                <input
                    type="text"
                    name="dia_semana"
                    value={form.dia_semana}
                    onChange={handleInputChange}
                    placeholder="Dia da Semana"
                />
                <input
                    type="text"
                    name="horario_pico"
                    value={form.horario_pico}
                    onChange={handleInputChange}
                    placeholder="Horário de Pico"
                />
                <input
                    type="number"
                    name="gatos_adotados"
                    value={form.gatos_adotados}
                    onChange={handleInputChange}
                    placeholder="Gatos Adotados"
                />
                <input
                    type="number"
                    name="faturamento_diario"
                    value={form.faturamento_diario}
                    onChange={handleInputChange}
                    placeholder="Faturamento Diário"
                />
                <input
                    type="number"
                    name="alcance_instagram"
                    value={form.alcance_instagram}
                    onChange={handleInputChange}
                    placeholder="Alcance Instagram"
                />
                <input
                    type="number"
                    name="alcance_facebook"
                    value={form.alcance_facebook}
                    onChange={handleInputChange}
                    placeholder="Alcance Facebook"
                />
                <input
                    type="number"
                    name="alcance_tiktok"
                    value={form.alcance_tiktok}
                    onChange={handleInputChange}
                    placeholder="Alcance TikTok"
                />
                <input
                    type="text"
                    name="idade_instagram"
                    value={form.idade_instagram}
                    onChange={handleInputChange}
                    placeholder="Idade Instagram"
                />
                <input
                    type="text"
                    name="idade_facebook"
                    value={form.idade_facebook}
                    onChange={handleInputChange}
                    placeholder="Idade Facebook"
                />
                <input
                    type="text"
                    name="idade_tiktok"
                    value={form.idade_tiktok}
                    onChange={handleInputChange}
                    placeholder="Idade TikTok"
                />
                <input
                    type="number"
                    name="qtd_clientes"
                    value={form.qtd_clientes}
                    onChange={handleInputChange}
                    placeholder="Quantidade de Clientes"
                />
                <input
                    type="text"
                    name="maioria_sexo"
                    value={form.maioria_sexo}
                    onChange={handleInputChange}
                    placeholder="Maioria Sexo"
                />
                <button type="submit">Adicionar Dados de Marketing</button>
            </form>
        </div>
    );
};

export default InserirMarketingPage;
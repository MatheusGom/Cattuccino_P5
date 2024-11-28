import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InserirData.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const InsertData = () => {
    const { userType } = useParams();
    const [activeButton, setActiveButton] = useState('add');
    const [activeForm, setActiveForm] = useState('marketing');

    const [formFinanceiro, setFormFinanceiro] = useState({
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

    const [formMarketing, setFormMarketing] = useState({
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

    const handleInputChange = (e, formSetter) => {
        const { name, value } = e.target;
        formSetter((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmitFinanceiro = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/financeiro', formFinanceiro);
            alert('Dados financeiros criados com sucesso!');
            setFormFinanceiro({
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

    const handleSubmitMarketing = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/marketing', formMarketing);
            alert('Dados de marketing criados com sucesso!');
            setFormMarketing({
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

    useEffect(() => {
        setActiveButton('add');
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar activeButton={activeButton} setActiveButton={setActiveButton} userType={userType} />
            </div>
            <div className={styles['main-content']}>
                <div className={styles.header}>
                    <Header activeButton={activeButton} />
                </div>
                <div className={styles['button-container']}>
                    <button
                        className={`${styles['selection-button']} ${activeForm === 'marketing' ? styles['active-button'] : ''}`}
                        onClick={() => setActiveForm('marketing')}
                    >
                        Marketing
                    </button>
                    <button
                        className={`${styles['selection-button']} ${activeForm === 'financeiro' ? styles['active-button'] : ''}`}
                        onClick={() => setActiveForm('financeiro')}
                    >
                        Financeiro
                    </button>
                </div>
                {activeForm === 'financeiro' && (
                    <div className={styles['form-container']}>
                        <form onSubmit={handleSubmitFinanceiro} className={styles.form}>
                            <div className={styles['form-col']}>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Data da Transação</p>
                                    <input
                                        type="date"
                                        name="data_transacao"
                                        value={formFinanceiro.data_transacao}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Data da Transação"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Preço unitário</p>
                                    <input
                                        type="number"
                                        name="preco_unitario"
                                        value={formFinanceiro.preco_unitario}
                                        onChange={(e) => {
                                            handleInputChange(e, setFormFinanceiro);
                                            const precoTotal = e.target.value * formFinanceiro.qtd_comprada;
                                            setFormFinanceiro((prevForm) => ({
                                                ...prevForm,
                                                preco_total: precoTotal,
                                                lucro_produto: formFinanceiro.faturamento_produto - precoTotal,
                                            }));
                                        }}
                                        placeholder="R$ 0,00"
                                        step="0.01"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Quantidade comprada</p>
                                    <input
                                        type="number"
                                        name="qtd_comprada"
                                        value={formFinanceiro.qtd_comprada}
                                        onChange={(e) => {
                                            handleInputChange(e, setFormFinanceiro);
                                            const precoTotal = formFinanceiro.preco_unitario * e.target.value;
                                            setFormFinanceiro((prevForm) => ({
                                                ...prevForm,
                                                preco_total: precoTotal,
                                                lucro_produto: formFinanceiro.faturamento_produto - precoTotal,
                                            }));
                                        }}
                                        placeholder="0"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Preço total</p>
                                    <input
                                        type="number"
                                        name="preco_total"
                                        value={formFinanceiro.preco_total}
                                        readOnly
                                        placeholder="R$0,00"
                                        step="0.01"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Nome do Produto</p>
                                    <input
                                        type="text"
                                        name="nome_produto"
                                        value={formFinanceiro.nome_produto}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Nome"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Marca do Produto</p>
                                    <input
                                        type="text"
                                        name="marca_produto"
                                        value={formFinanceiro.marca_produto}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Marca"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles['form-col']}>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Categoria do Produto</p>
                                    <input
                                        type="text"
                                        name="categoria_produto"
                                        value={formFinanceiro.categoria_produto}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Categoria"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Descrição do Produto</p>
                                    <input
                                        type="text"
                                        name="descricao_produto"
                                        value={formFinanceiro.descricao_produto}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Descrição"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Faturamento do Produto</p>
                                    <input
                                        type="number"
                                        name="faturamento_produto"
                                        value={formFinanceiro.faturamento_produto}
                                        onChange={(e) => {
                                            handleInputChange(e, setFormFinanceiro);
                                            const lucroProduto =
                                                e.target.value - formFinanceiro.preco_total;
                                            setFormFinanceiro((prevForm) => ({
                                                ...prevForm,
                                                lucro_produto: lucroProduto,
                                            }));
                                        }}
                                        placeholder="R$ 0,00"
                                        step="0.01"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Lucro do Produto</p>
                                    <input
                                        type="number"
                                        name="lucro_produto"
                                        value={formFinanceiro.lucro_produto}
                                        readOnly
                                        placeholder="R$ 0,00"
                                        step="0.01"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>CNPJ Fornecedor</p>
                                    <input
                                        type="text"
                                        name="cnpj_fornecedor"
                                        value={formFinanceiro.cnpj_fornecedor}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="CNPJ"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Nome do Fornecedor</p>
                                    <input
                                        type="text"
                                        name="nome_fornecedor"
                                        value={formFinanceiro.nome_fornecedor}
                                        onChange={(e) => handleInputChange(e, setFormFinanceiro)}
                                        placeholder="Nome"
                                        className={styles.input}
                                    />
                                </div>
                                <button type="submit" className={styles.button}>
                                    <p>Adicionar</p>
                                    <img src="/images/add_Data.svg" alt="Botão de adicionar" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {activeForm === 'marketing' && (
                    <div className={styles['form-container']}>
                        <form onSubmit={handleSubmitMarketing} className={styles.form}>
                            <div className={styles['form-col']}>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Data</p>
                                    <input
                                        type="date"
                                        name="data_id"
                                        value={formMarketing.data_id}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Data"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Dia da Semana</p>
                                    <input
                                        type="text"
                                        name="dia_semana"
                                        value={formMarketing.dia_semana}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Dia da Semana"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Horário de Pico</p>
                                    <input
                                        type="text"
                                        name="horario_pico"
                                        value={formMarketing.horario_pico}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Horário de Pico"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Gatos Adotados</p>
                                    <input
                                        type="number"
                                        name="gatos_adotados"
                                        value={formMarketing.gatos_adotados}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Gatos Adotados"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Faturamento Diário</p>
                                    <input
                                        type="number"
                                        name="faturamento_diario"
                                        value={formMarketing.faturamento_diario}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="R$ 0,00"
                                        step="0.01"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Alcance Instagram</p>
                                    <input
                                        type="number"
                                        name="alcance_instagram"
                                        value={formMarketing.alcance_instagram}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Alcance Instagram"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Quantidade de Clientes</p>
                                    <input
                                        type="number"
                                        name="qtd_clientes"
                                        value={formMarketing.qtd_clientes}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="0"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles['form-col']}>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Alcance Facebook</p>
                                    <input
                                        type="number"
                                        name="alcance_facebook"
                                        value={formMarketing.alcance_facebook}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Alcance Facebook"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Alcance TikTok</p>
                                    <input
                                        type="number"
                                        name="alcance_tiktok"
                                        value={formMarketing.alcance_tiktok}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Alcance TikTok"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Idade Instagram</p>
                                    <input
                                        type="text"
                                        name="idade_instagram"
                                        value={formMarketing.idade_instagram}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Idade Instagram"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Idade Facebook</p>
                                    <input
                                        type="text"
                                        name="idade_facebook"
                                        value={formMarketing.idade_facebook}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Idade Facebook"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Idade TikTok</p>
                                    <input
                                        type="text"
                                        name="idade_tiktok"
                                        value={formMarketing.idade_tiktok}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="Idade TikTok"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.row}>
                                    <p className={styles['form-p']}>Maioria Sexo</p>
                                    <input
                                        type="text"
                                        name="maioria_sexo"
                                        value={formMarketing.maioria_sexo}
                                        onChange={(e) => handleInputChange(e, setFormMarketing)}
                                        placeholder="M - F"
                                        className={styles.input}
                                    />
                                </div>
                                <button type="submit" className={styles.button}>
                                    <p>Adicionar</p>
                                    <img src="/images/add_Data.svg" alt="Botão de adicionar" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsertData;

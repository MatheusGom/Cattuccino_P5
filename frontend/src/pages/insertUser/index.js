import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './InsertUser.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import RatingField from '../../components/RatingField';

const InsertUser = () => {
    const { userType } = useParams();
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

    const [activeButton, setActiveButton] = useState('management');

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
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar activeButton={activeButton} setActiveButton={setActiveButton} userType={userType} />
            </div>
            <div className={styles['main-content']}>
                <div className={styles.header}>
                    <Header activeButton={'user'} />
                </div>
                <div className={styles['form-container']}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles['form-col']}>
                            <h2 className={styles['personal-info']}>Informações Pessoais</h2>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Nome</p>
                                <input
                                    type="text"
                                    name="NOME"
                                    value={form.NOME}
                                    onChange={handleInputChange}
                                    placeholder="Nome"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Email</p>
                                <input
                                    type="text"
                                    name="EMAIL"
                                    value={form.EMAIL}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Senha</p>
                                <input
                                    type="password"
                                    name="SENHA"
                                    value={form.SENHA}
                                    onChange={handleInputChange}
                                    placeholder="Senha"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Idade</p>
                                <input
                                    type="number"
                                    name="IDADE"
                                    value={form.IDADE}
                                    onChange={handleInputChange}
                                    placeholder="Idade"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Localização</p>
                                <input
                                    type="text"
                                    name="LOCALIZACAO"
                                    value={form.LOCALIZACAO}
                                    onChange={handleInputChange}
                                    placeholder="Localização"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Tipo Sanguíneo</p>
                                <input
                                    type="text"
                                    name="TIPO_SANGUINEO"
                                    value={form.TIPO_SANGUINEO}
                                    onChange={handleInputChange}
                                    placeholder="Tipo Sanguíneo"
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <div className={styles['form-col-r']}>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Formação</p>
                                <input
                                    type="text"
                                    name="FORMACAO"
                                    value={form.FORMACAO}
                                    onChange={handleInputChange}
                                    placeholder="Formação"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Data de Nascimento</p>
                                <input
                                    type="date"
                                    name="DT_NASCIMENTO"
                                    value={form.DT_NASCIMENTO}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Cor</p>
                                <input
                                    type="text"
                                    name="COR"
                                    value={form.COR}
                                    onChange={handleInputChange}
                                    placeholder="Cor"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Gênero</p>
                                <input
                                    type="text"
                                    name="GENERO"
                                    value={form.GENERO}
                                    onChange={handleInputChange}
                                    placeholder="Gênero"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.row}>
                                <p className={styles['form-p']}>Data de Admissão</p>
                                <input
                                    type="date"
                                    name="DT_ADMISSAO"
                                    value={form.DT_ADMISSAO}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                        <div className={styles['classificatory-container']}>
                            <div className={styles['classificatory-inputs']}>
                                <div className={styles['row-cl']}>
                                    <p className={styles['form-p']}>Extrovertido</p>
                                    <RatingField
                                        label="Extrovertido"
                                        name="EXTROVERTID"
                                        value={form.EXTROVERTID}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles['row-cl']}>
                                    <p className={styles['form-p']}>Criativo</p>
                                    <RatingField
                                        label="Criativo"
                                        name="CRIATIV"
                                        value={form.CRIATIV}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles['row-cl']}>
                                    <p className={styles['form-p']}>Ocupado</p>
                                    <RatingField
                                        label="Ocupado"
                                        name="OCUPAD"
                                        value={form.OCUPAD}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles['row-cl']}>
                                    <p className={styles['form-p']}>Organizado</p>
                                    <RatingField
                                        label="Organizado"
                                        name="ORGANIZAD"
                                        value={form.ORGANIZAD}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles['row-cl']}>
                                    <p className={styles['form-p']}>Tranquilo</p>
                                    <RatingField
                                        label="Tranquilo"
                                        name="TRANQUIL"
                                        value={form.TRANQUIL}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.button}>
                                <p>Adicionar Usuário</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InsertUser;

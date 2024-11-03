import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from './Dashboard.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    const { userType, type } = useParams();
    const [activeButton, setActiveButton] = useState('home');
    
    return (
        <>
            <Header activeButton={activeButton} />
            <Sidebar userType={userType} activeButton={activeButton} setActiveButton={setActiveButton} />
            <div className={styles.dashboard}>
                {type === "marketing" ? (
                    <div className={styles.marketingDashboard}>
                        <h1>Marketing</h1>
                
                        <div className={styles.faturamentoDiario}>
                            <div>
                                <img src="/images/Frame 80.png" alt="Descrição da Imagem" />
                            </div>
                            <div className={styles.icone}>
                            <img
                            src='/images/adicionar_pessoa.svg'
                            alt='add'
                        />
                        </div>
                        </div>

                        <div className={styles.caixaRedesSociais}>
                            <h1>Usuários ativos</h1>
                            <h2>Distribuição das redes sociais</h2>
                            {/* Aqui você pode adicionar o conteúdo específico para essa caixa */}
                        </div>

                        {/* Nova caixa para usuários ativos geral */}
                        <div className={styles.caixaUsuariosAtivos}>
                            <h2>Usuários Ativos Geral</h2>
                            {/* Aqui você pode adicionar o conteúdo específico para essa caixa */}
                        </div>
                    </div>
                ) : (
                    <div className={styles.generalDashboard}>
                        {/* Conteúdo do dashboard geral */}
                        <h1>Dashboard Geral</h1>
                        <p>Esta é a visão geral do seu dashboard.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;

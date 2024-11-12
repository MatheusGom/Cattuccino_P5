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

                        <div className={styles.coluna}>
                            {/* Caixa Faturamento Diário - Original */}
                            <div className={styles.faturamentoDiario}>
                                <div className={styles.infoClientes}>
                                    <p className={styles.titulo}>Novos Clientes</p>
                                    <div className={styles.dados}>
                                        <span className={styles.numero}>+3.052</span>
                                        <span className={styles.percentual}>+14%</span>
                                    </div>
                                </div>
                                <div className={styles.icone}>
                                    <img src='/images/adicionar_pessoa.svg' alt='add' />
                                </div>
                            </div>

                            {/* Caixa Redes Sociais - Original */}
                            <div className={styles.caixaRedesSociais}>
                                <div className={styles.infoClientes}>
                                    <p className={styles.tituloRedesSociais}>Usuários ativos</p>
                                    <p className={styles.subtituloRedesSociais}>Distribuição das redes sociais</p>
                                </div>
                                <div className={styles.iconepizza}>
                                    <img src='/images/GraficoPizza.svg' alt='grafico pizza' />
                                </div>
                                <div className={styles.iconeredes}>
                                    <img src='/images/redessociais.svg' alt='redessociais' />
                                </div>
                            </div>

                            {/* Caixa Usuários Ativos - Original */}
                            <div className={styles.caixaUsuariosAtivos}>
                                <div className={styles.graficoatividade}>
                                    <img src='/images/GraficoAtivos.svg' alt='Grafico Ativos' />
                                </div>
                                <p className={styles.tituloRedesSociais}>Usuários ativos</p>
                                <div className={styles.linhaPercentual}>
                                    <span className={styles.percentual}>(+23%)</span>
                                    <p className={styles.subtituloRedesSociais}>que na última semana</p>
                                </div>
                                <p className={styles.tituloRedesSociais}>Dados dos Usuários</p>

                                <div className={styles.container}>
                                    <img className={styles['box-image']} src='/images/Usuariosredes.svg' alt='Usuarios da rede' />
                                    <img className={styles['box-image']} src='/images/Clickredes.svg' alt='cliques' />
                                    <img className={styles['box-image']} src='/images/Vendasredes.svg' alt='Vendas das redes' />
                                    <img className={styles['box-image']} src='/images/ItensRedes.svg' alt='Itens' />
                                </div>
                                <div className={styles.containernumeros}>
                                    <p className={styles.numeroIndividual}>32,904</p>
                                    <p className={styles.numeroIndividual}>2,42m</p>
                                    <p className={styles.numeroIndividual}>2,400$</p>
                                    <p className={styles.numeroIndividual}>320</p>
                                </div>
                                <div className={styles.containerlinha}>
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                </div>
                            </div>
                        </div>
                        <div className={styles.coluna}>
                            {/* Caixa Faturamento Diário - Duplicada */}
                            <div className={styles.faturamentoDiario}>
                                <div className={styles.infoClientes}>
                                    <p className={styles.titulo}>Novos Clientes</p>
                                    <div className={styles.dados}>
                                        <span className={styles.numero}>+4.200</span>
                                        <span className={styles.percentual}>+10%</span>
                                    </div>
                                </div>
                                <div className={styles.icone}>
                                    <img src='/images/adicionar_pessoa.svg' alt='add' />
                                </div>
                            </div>

                            {/* Caixa Redes Sociais - Duplicada */}
                            <div className={styles.caixaRedesSociais}>
                                <div className={styles.infoClientes}>
                                    <p className={styles.tituloRedesSociais}>Usuários ativos</p>
                                    <p className={styles.subtituloRedesSociais}>Distribuição das redes sociais</p>
                                </div>
                                <div className={styles.iconepizza}>
                                    <img src='/images/GraficoPizza.svg' alt='grafico pizza' />
                                </div>
                                <div className={styles.iconeredes}>
                                    <img src='/images/redessociais.svg' alt='redessociais' />
                                </div>
                            </div>

                            {/* Caixa Usuários Ativos - Duplicada */}
                            <div className={styles.caixaUsuariosAtivos}>
                                <div className={styles.graficoatividade}>
                                    <img src='/images/GraficoAtivos.svg' alt='Grafico Ativos' />
                                </div>
                                <p className={styles.tituloRedesSociais}>Usuários ativos</p>
                                <div className={styles.linhaPercentual}>
                                    <span className={styles.percentual}>(+25%)</span>
                                    <p className={styles.subtituloRedesSociais}>que na última semana</p>
                                </div>
                                <p className={styles.tituloRedesSociais}>Dados dos Usuários</p>

                                <div className={styles.container}>
                                    <img className={styles['box-image']} src='/images/Usuariosredes.svg' alt='Usuarios da rede' />
                                    <img className={styles['box-image']} src='/images/Clickredes.svg' alt='cliques' />
                                    <img className={styles['box-image']} src='/images/Vendasredes.svg' alt='Vendas das redes' />
                                    <img className={styles['box-image']} src='/images/ItensRedes.svg' alt='Itens' />
                                </div>
                                <div className={styles.containernumeros}>
                                    <p className={styles.numeroIndividual}>35,500</p>
                                    <p className={styles.numeroIndividual}>2,50m</p>
                                    <p className={styles.numeroIndividual}>2,500$</p>
                                    <p className={styles.numeroIndividual}>350</p>
                                </div>
                                <div className={styles.containerlinha}>
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                    <img className={styles['box-image2']} src='/images/linhadados.svg' alt='linha' />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.generalDashboard}>
                        <h1>Dashboard Geral</h1>
                        <p>Esta é a visão geral do seu dashboard.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;

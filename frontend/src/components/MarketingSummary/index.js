import React, { useEffect, useState } from 'react';
import styles from './MarketingSummary.module.css';
import axios from 'axios';

const MarketingSummary = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/marketing/summary');
                setData(response.data);
            } catch (error) {
                console.error('Erro ao buscar dados do resumo de marketing:', error);
            }
        };

        fetchData();
    }, []);

    const getVariationColor = (variation) => (variation >= 0 ? '#28a745' : '#dc3545');

    if (!data) {
        return <p>Carregando resumo de marketing...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles['card-content']}>
                    <span className={styles.label}>Usuários Diários</span>
                    <div className={styles['card-info']}>
                        <h2 className={styles.value}>{data.clientes_novos_diarios.toLocaleString('pt-BR')}</h2>
                        <span
                            className={styles.variation}
                            style={{ color: getVariationColor(data.variacao_clientes) }}
                        >
                            {data.variacao_clientes > 0 ? `+${data.variacao_clientes}%` : `${data.variacao_clientes}%`}
                        </span>
                    </div>
                </div>
                <div className={styles.icon}>
                    <img src='/images/new_clients.svg' />
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles['card-content']}>
                    <span className={styles.label}>Alcance Total</span>
                    <div className={styles['card-info']}>
                        <h2 className={styles.value}>{data.alcance_total.toLocaleString('pt-BR')}</h2>
                    </div>
                </div>
                <div className={styles.icon}>
                    <img src='/images/day_users.svg' />
                </div>
            </div>
        </div>
    );
};

export default MarketingSummary;
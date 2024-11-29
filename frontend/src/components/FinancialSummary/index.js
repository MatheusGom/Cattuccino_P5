import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './FinancialSummary.module.css';

const FinancialSummary = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/financial/summary');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erro ao buscar dados do resumo financeiro:', error);
        alert('Erro ao buscar dados do resumo financeiro');
      }
    };

    fetchFinancialSummary();
  }, []);

  if (!data) {
    return <div>Carregando...</div>;
  }

  const {
    faturamento_diario,
    variacao_diaria,
    faturamento_total,
    variacao_total,
  } = data;

  const getVariationColor = (variation) => (variation >= 0 ? '#28a745' : '#dc3545');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles['card-content']}>
          <span className={styles.label}>Faturamento Diário</span>
          <div className={styles['card-info']}>
            <h2 className={styles.value}>
              R${faturamento_diario.toLocaleString('pt-BR')}
            </h2>
            <span
              className={styles.variation}
            >
              {variacao_diaria > 0 ? `+${variacao_diaria}%` : `${variacao_diaria}%`}
            </span>
          </div>
        </div>
        <div className={styles.icon}>
          <img src='/images/financial_component.svg' alt='Ícone de sifrão' />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles['card-content']}>
          <span className={styles.label}>Faturamento Total</span>
          <div className={styles['card-info']}>
            <h2 className={styles.value}>
              R${faturamento_total.toLocaleString('pt-BR')}
            </h2>
            <span
              className={styles.variation}
            >
              {variacao_total > 0 ? `+${variacao_total}%` : `${variacao_total}%`}
            </span>
          </div>
        </div>
        <div className={styles.icon}>
          <img src='/images/financial_component.svg' alt='Ícone de sifrão' />
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;

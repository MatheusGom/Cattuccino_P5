import React from 'react';
import PropTypes from 'prop-types';
import styles from './FinancialSummary.module.css';

const FinancialSummary = ({ data }) => {
  const {
    faturamento_diario,
    variacao_diaria,
    faturamento_total,
    variacao_total,
  } = data;

  const getVariationColor = (variation) => (variation >= 0 ? '#28a745' : '#dc3545');

  return (
    <div className={styles.container}>=
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <span className={styles.label}>Faturamento Diário</span>
          <h2 className={styles.value}>
            R${faturamento_diario.toLocaleString('pt-BR')}
          </h2>
          <span
            className={styles.variation}
            style={{ color: getVariationColor(variacao_diaria) }}
          >
            {variacao_diaria > 0 ? `+${variacao_diaria}%` : `${variacao_diaria}%`}
          </span>
        </div>
        <div className={styles.icon}>
          <span>💰</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <span className={styles.label}>Faturamento Total</span>
          <h2 className={styles.value}>
            R${faturamento_total.toLocaleString('pt-BR')}
          </h2>
          <span
            className={styles.variation}
            style={{ color: getVariationColor(variacao_total) }}
          >
            {variacao_total > 0 ? `+${variacao_total}%` : `${variacao_total}%`}
          </span>
        </div>
        <div className={styles.icon}>
          <span>📊</span>
        </div>
      </div>
    </div>
  );
};

FinancialSummary.propTypes = {
  data: PropTypes.shape({
    faturamento_diario: PropTypes.number.isRequired,
    variacao_diaria: PropTypes.number.isRequired,
    faturamento_total: PropTypes.number.isRequired,
    variacao_total: PropTypes.number.isRequired,
  }).isRequired,
};

export default FinancialSummary;

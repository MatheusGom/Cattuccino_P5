import React from 'react';
import styles from './InitialBackground.module.css'

function InitialBackground() {
    return (
        <>
            <div className={styles.title}>
                <h1>Bem Vindo!</h1><br />
                <p>Seja bem vindo ao nosso site de análises do Cattuccino</p>
            </div>
        </>
    );
}

export default InitialBackground;
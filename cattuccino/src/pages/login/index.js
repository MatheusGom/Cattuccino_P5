import React from 'react';
import styles from './Login.module.css';

function Login() {
    return (
        <>
        <div className={styles.title}>
            <h1>Bem Vindo!</h1>
            <p>Seja bem vindo ao nosso site de análises do Cattuccino</p>
        </div>
        <div className={styles.container}>
            <form className={styles['login-form']}>
                <img className={styles.logo} src='/images/logo.svg' alt='Logo' /><br />
                <p className={styles.subtitle}>Por favor, nos diga como você deseja entrar</p>
                <div className={styles.options}>
                    <div className={styles['selection-box']}>
                        <img className={styles['box-image']} src='/images/user.svg' alt='User' />
                        Usuário
                    </div>
                    <div className={styles['selection-box']}>
                        <img className={styles['box-image']} src='/images/manager.svg' alt='Manager' />
                        Gerente
                    </div>
                </div>
            </form>
        </div>
        </>
    );
}

export default Login;
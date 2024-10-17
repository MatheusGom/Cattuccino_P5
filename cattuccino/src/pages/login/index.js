import React from 'react';
import styles from './Login.module.css';
import InitialBackground from '../../components/InitialBackground';

function Login() {
    return (
        <>
            <InitialBackground/>
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
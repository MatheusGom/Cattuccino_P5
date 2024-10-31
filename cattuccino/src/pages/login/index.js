import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();

    const handleUserClick = (userType) => {
        navigate(`/usuario/${userType}`);
    };

    return (
        <>
            <div className={styles['background-login']}>
                <div className={styles.title}>
                    <h1>Bem Vindo!</h1><br />
                    <p>Seja bem vindo ao nosso site de análises do Cattuccino</p>
                </div>

                <div className={styles.container}>
                    <form className={styles['login-form']}>
                        <img className={styles.logo} src='/images/logo.svg' alt='Logo' /><br />
                        <p className={styles.subtitle}>Por favor, nos diga como você deseja entrar</p>
                        <div className={styles.options}>
                            <div className={styles['selection-box']} onClick={() => handleUserClick('1')}>
                                <img className={styles['box-image']} src='/images/user.svg' alt='Analist' />
                                Analista
                            </div>
                            <div className={styles['selection-box']} onClick={() => handleUserClick('2')}>
                                <img className={styles['box-image']} src='/images/manager.svg' alt='Manager' />
                                Gerente
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
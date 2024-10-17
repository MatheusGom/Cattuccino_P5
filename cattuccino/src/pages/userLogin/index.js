import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';
import InitialBackground from '../../components/InitialBackground';

function UserLogin() {
    
    const navigate = useNavigate();

    const backHome = () => {
        navigate('/');
    };

    return (
        <>
            <InitialBackground />
            <div className={styles.container}>
                <form className={styles['login-form']}>
                    <img className={styles.logo} onClick={backHome} src='/images/logo.svg' alt='Logo' /><br />
                    <div className={styles.info}>
                        <div className={styles['input-container']}>
                            <input
                                className={styles['form-input']}
                                type='email'
                                placeholder='E-mail'
                            />
                            <img className={styles.icon} src='/images/mail.svg' alt='e-mail' />
                        </div>
                        <div className={styles['input-container']}>
                            <input
                                className={styles['form-input']}
                                type='password'
                                placeholder='Senha'
                            />
                            <img className={styles.icon} src='/images/password.svg' alt='senha' />
                        </div>
                        <div className={styles['remember-me']}>
                            <label className={styles.switch}>
                                <input type="checkbox" />
                                <span className={styles.slider}></span>
                            </label>
                            <span>Lembrar de mim</span>
                        </div>
                    </div>
                    <button className={styles.send} type='submit'>Acessar</button>
                </form>
            </div>
        </>
    );
}

export default UserLogin;
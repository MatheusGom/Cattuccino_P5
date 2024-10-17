import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UserLogin.module.css';
import InitialBackground from '../../components/InitialBackground';

function UserLogin() {

    const navigate = useNavigate();
    const { userType } = useParams();

    const backHome = () => {
        navigate('/');
    };

    const getUserMessage = () => {
        if (userType === '1') {
            return 'Bem-vindo, Usuário!';
        } else if (userType === '2') {
            return 'Bem-vindo, Gerente!';
        } else {
            return 'Bem-vindo!';
        }
    };

    return (
        <>
            <InitialBackground />
            <div className={styles.container}>
                <form className={styles['login-form']}>
                    <img className={styles.logo} onClick={backHome} src='/images/logo.svg' alt='Logo' /><br />
                    <h2 className={styles.welcome}>{getUserMessage()}</h2>
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
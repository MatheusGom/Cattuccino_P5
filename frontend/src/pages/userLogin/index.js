import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './UserLogin.module.css';

function UserLogin() {
    const navigate = useNavigate();
    const { userType } = useParams();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedSenha = localStorage.getItem('rememberedSenha');
        if (rememberedEmail && rememberedSenha) {
            setEmail(rememberedEmail);
            setSenha(rememberedSenha);
            setRememberMe(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const backHome = () => {
        navigate('/');
    };

    const getUserMessage = () => {
        if (userType === '1') {
            return 'Bem-vindo, Analista!';
        } else if (userType === '2') {
            return 'Bem-vindo, Gerente!';
        } else {
            return 'Bem-vindo!';
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                EMAIL: email,
                SENHA: senha,
            });
            if (response.status === 200) {
                const usuario = response.data;
                const isGerente = usuario.GERENCIA === 1;
                if ((userType === '2' && !isGerente) || (userType === '1' && isGerente)) {
                    setError('Você não tem permissão de acesso.');
                    setShowErrorModal(true);
                    return;
                }
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedSenha', senha);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedSenha');
                }
                navigate(`/dashboard/${userType}`);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('E-mail e/ou senha inválidos, tente novamente.');
            } else {
                setError('Erro ao tentar realizar o login, por favor, tente novamente mais tarde.');
            }
            setShowErrorModal(true);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <>
            <div className={styles['background-user-login']}>
                <div className={styles.title}>
                    <h1>Bem Vindo!</h1><br />
                    <p>Seja bem vindo ao nosso site de análises do Cattuccino</p>
                </div>

                <div className={styles.container}>
                    <form className={styles['login-form']} onSubmit={handleLogin}>
                        <img className={styles.logo} onClick={backHome} src='/images/logo.svg' alt='Logo' title='Voltar'/><br />
                        <h2 className={styles.welcome}>{getUserMessage()}</h2>
                        <div className={styles.info}>
                            <div className={styles['input-container']}>
                                <input
                                    className={styles['form-input']}
                                    type='email'
                                    placeholder='E-mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <img className={styles.icon} src='/images/mail.svg' alt='e-mail' />
                            </div>
                            <div className={styles['input-container']}>
                                <input
                                    className={styles['form-input']}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Senha'
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <img
                                    className={styles.icon}
                                    src={showPassword ? '/images/hide.svg' : '/images/show.svg'}
                                    alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    onClick={togglePasswordVisibility}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className={styles['remember-me']}>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <span>Lembrar de mim</span>
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                        </div>
                        <button className={styles.send} type='submit'>Acessar</button>
                    </form>
                </div>
            </div>

            {showErrorModal && (
                <div className={styles['error-modal']}>
                    <div className={styles['modal-content']}>
                        <p>{error}</p>
                        <button className={styles['close-button']} onClick={closeErrorModal}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserLogin;

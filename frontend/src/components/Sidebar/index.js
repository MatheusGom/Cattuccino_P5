import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ userType, activeButton, setActiveButton }) {
    const navigate = useNavigate();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleButtonClick = (button) => {
        if (button === 'logout') {
            setShowLogoutPopup(true);
        } else if (button === 'add') {
            navigate(`/dashboard/${userType}/dados/novo`);
        } else {
            setActiveButton(button);
        }
    };

    const confirmLogout = () => {
        setShowLogoutPopup(false);
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutPopup(false);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles['upper-logo']}>
                <img src="/images/sideBarLogo.svg" alt="Logo" className={styles.logo} />
            </div>
            <div className={styles['button-list']}>

                <div
                    className={`${styles['button-container']} ${activeButton === 'home' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('home')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'home'
                            ? "/images/home_button_pressed.svg"
                            : "/images/home_button.svg"}
                        alt="Home Button"
                    />
                    <p className={styles['button-text']}>Home</p>
                </div>

                <div
                    className={`${styles['button-container']} ${activeButton === 'financial' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('financial')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'financial'
                            ? "/images/financial_button_pressed.svg"
                            : "/images/financial_button.svg"}
                        alt="Financial Button"
                    />
                    <p className={styles['button-text']}>Financeiro</p>
                </div>

                <div
                    className={`${styles['button-container']} ${activeButton === 'marketing' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('marketing')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'marketing'
                            ? "/images/marketing_button_pressed.svg"
                            : "/images/marketing_button.svg"}
                        alt="Marketing Button"
                    />
                    <p className={styles['button-text']}>Marketing</p>
                </div>

                {userType === '2' && (
                    <div
                        className={`${styles['button-container']} ${activeButton === 'management' ? styles.active : ''}`}
                        onClick={() => handleButtonClick('management')}
                    >
                        <img className={styles['side-buttons']}
                            src={activeButton === 'management'
                                ? "/images/management_button_pressed.svg"
                                : "/images/management_button.svg"}
                            alt="Management Button"
                        />
                        <p className={styles['button-text']}>Gerenciamento</p>
                    </div>
                )}

                <div
                    className={`${styles['button-container']} ${activeButton === 'add' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('add')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'add'
                            ? "/images/add_button_pressed.svg"
                            : "/images/add_button.svg"}
                        alt="Marketing Button"
                    />
                    <p className={styles['button-text']}>Dados</p>
                </div>

                <div className={styles.title}>
                    <p>CONTA</p>
                </div>

                <div
                    className={`${styles['button-container']} ${activeButton === 'profile' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('profile')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'profile'
                            ? "/images/profile_button_pressed.svg"
                            : "/images/profile_button.svg"}
                        alt="Profile Button"
                    />
                    <p className={styles['button-text']}>Perfil</p>
                </div>

                <div
                    className={`${styles['button-container']} ${activeButton === 'configurations' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('configurations')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'configurations'
                            ? "/images/configuration_button_pressed.svg"
                            : "/images/configuration_button.svg"}
                        alt="Configurations Button"
                    />
                    <p className={styles['button-text']}>Configurações</p>
                </div>

                <div
                    className={`${styles['button-container']} ${activeButton === 'logout' ? styles.active : ''}`}
                    onClick={() => handleButtonClick('logout')}
                >
                    <img className={styles['side-buttons']}
                        src={activeButton === 'logout'
                            ? "/images/logout_button_pressed.svg"
                            : "/images/logout_button.svg"}
                        alt="Logout Button"
                    />
                    <p className={styles['button-text']}>Sair</p>
                </div>
            </div>
            {showLogoutPopup && (
                <div className={styles['popup-overlay']}>
                    <div className={styles['popup-content']}>
                        <p>Tem certeza que deseja sair?</p>
                        <button className={styles['popup-button']} onClick={confirmLogout}>Sim</button>
                        <button className={styles['popup-button']} onClick={cancelLogout}>Não</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ userType }) {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('home');

    const handleButtonClick = (button, route) => {
        setActiveButton(button);
        navigate(route);
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles['upper-logo']}>
                <img src="/images/sideBarLogo.svg" alt="Logo" className={styles.logo} />
            </div>
            <div className={styles['button-list']}> 

                <div onClick={() => handleButtonClick('home', ``)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'home'
                            ? "/images/home_button_pressed.svg"
                            : "/images/home_button.svg"}
                        alt="Home Button"
                    />
                </div>

                <div onClick={() => handleButtonClick('financial', `/financeiro/${userType}`)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'financial'
                            ? "/images/financial_button_pressed.svg"
                            : "/images/financial_button.svg"}
                        alt="Financial Button"
                    />
                </div>

                <div onClick={() => handleButtonClick('marketing', ``)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'marketing'
                            ? "/images/marketing_button_pressed.svg"
                            : "/images/marketing_button.svg"}
                        alt="Marketing Button"
                    />
                </div>

                {userType === '2' && (
                    <div onClick={() => handleButtonClick('management', ``)}>
                        <img className={styles['side-buttons']}
                            src={activeButton === 'management'
                                ? "/images/management_button_pressed.svg"
                                : "/images/management_button.svg"}
                            alt="Management Button"
                        />
                    </div>
                )}

                <div className={styles.title}>
                    <p>CONTA</p>
                </div>

                <div onClick={() => handleButtonClick('profile', ``)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'profile'
                            ? "/images/profile_button_pressed.svg"
                            : "/images/profile_button.svg"}
                        alt="Profile Button"
                    />
                </div>

                <div onClick={() => handleButtonClick('configurations', ``)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'configurations'
                            ? "/images/configuration_button_pressed.svg"
                            : "/images/configuration_button.svg"}
                        alt="Configurations Button"
                    />
                </div>

                <div onClick={() => handleButtonClick('logout', `/`)}>
                    <img className={styles['side-buttons']}
                        src={activeButton === 'logout'
                            ? "/images/logout_button_pressed.svg"
                            : "/images/logout_button.svg"}
                        alt="Logout Button"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;

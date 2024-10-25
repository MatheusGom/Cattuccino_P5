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
            <ul className={styles.buttonList}>

                <li onClick={() => handleButtonClick('home', ``)}>
                    <img 
                        src={activeButton === 'home' 
                            ? "/images/home_button_pressed.svg" 
                            : "/images/home_button.svg"} 
                        alt="Home Button" 
                    />
                </li>

                <li onClick={() => handleButtonClick('financial', `/financeiro/${userType}`)}>
                    <img 
                        src={activeButton === 'financial' 
                            ? "/images/financial_button_pressed.svg" 
                            : "/images/financial_button.svg"} 
                        alt="Financial Button" 
                    />
                </li>

                <li onClick={() => handleButtonClick('marketing', ``)}>
                    <img 
                        src={activeButton === 'marketing' 
                            ? "/images/marketing_button_pressed.svg" 
                            : "/images/marketing_button.svg"} 
                        alt="Marketing Button" 
                    />
                </li>

                {userType === '2' && (
                    <li onClick={() => handleButtonClick('management', ``)}>
                        <img 
                            src={activeButton === 'management' 
                                ? "/images/management_button_pressed.svg" 
                                : "/images/management_button.svg"} 
                            alt="Management Button" 
                        />
                    </li>
                )}

                <div className={styles.title}>
                    <br/>
                    <h1>Conta</h1>
                    <br/>
                </div>

                <li onClick={() => handleButtonClick('profile', ``)}>
                    <img 
                        src={activeButton === 'profile' 
                            ? "/images/profile_button_pressed.svg" 
                            : "/images/profile_button.svg"} 
                        alt="Profile Button" 
                    />
                </li>

                <li onClick={() => handleButtonClick('configurations', ``)}>
                    <img 
                        src={activeButton === 'configurations' 
                            ? "/images/configuration_button_pressed.svg" 
                            : "/images/configuration_button.svg"} 
                        alt="Configurations Button" 
                    />
                </li>

                <li onClick={() => handleButtonClick('logout', `/`)}>
                    <img 
                        src={activeButton === 'logout' 
                            ? "/images/logout_button_pressed.svg" 
                            : "/images/logout_button.svg"} 
                        alt="Logout Button" 
                    />
                </li>
            </ul>

        </div>
    );
}

export default Sidebar;

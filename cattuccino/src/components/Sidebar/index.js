import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ userType }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeButton, setActiveButton] = useState('home');

    useEffect(() => {

        const currentPath = location.pathname;

        if (currentPath.includes('/financeiro')) {
            setActiveButton('financial');
        } 
        
        else if (currentPath.includes('/marketing')) {
            setActiveButton('marketing');
        } 
        
        else if (currentPath.includes('/gerenciamento') && userType === '2') {
            setActiveButton('management');
        } 
        
        else if (currentPath.includes('/perfil')) {
            setActiveButton('profile');
        } 
        
        else if (currentPath.includes('/configuracoes')) {
            setActiveButton('configuration');
        } 
        
        else {
            setActiveButton('home');
        }
    }, [location.pathname, userType]);

    const handleButtonClick = (button, route) => {
        setActiveButton(button);
        navigate(route);
    };

    return (
        <div className={styles.sidebar}>
            <ul className={styles.buttonList}>

                <li onClick={() => handleButtonClick('home', `/home/${userType}`)}>
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

                <li onClick={() => handleButtonClick('marketing', `/marketing/${userType}`)}>
                    <img 
                        src={activeButton === 'marketing' 
                            ? "/images/marketing_button_pressed.svg" 
                            : "/images/marketing_button.svg"} 
                        alt="Marketing Button" 
                    />
                </li>

                {userType === '2' && (
                    <li onClick={() => handleButtonClick('management', `/gerenciamento/${userType}`)}>
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

                <li onClick={() => handleButtonClick('profile', `/perfil/${userType}`)}>
                    <img 
                        src={activeButton === 'profile' 
                            ? "/images/profile_button_pressed.svg" 
                            : "/images/profile_button.svg"} 
                        alt="Profile Button" 
                    />
                </li>

                <li onClick={() => handleButtonClick('configurations', `/configuracoes/${userType}`)}>
                    <img 
                        src={activeButton === 'configuration' 
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

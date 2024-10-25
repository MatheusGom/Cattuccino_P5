import React from 'react';
import styles from './Header.module.css';
import { useState } from 'react';

function Header() {

    const [searchValue, setSearchValue] = useState('');

    return (
        <>
        
            <div className={styles.head}>
                <h3 className={styles['head-title']}>Dashboard</h3>
                <div className={styles['container']}>
                    <div className={styles.info}>
                        <img
                            className={`${styles['search-icon']} ${searchValue ? styles['icon-active'] : ''}`}
                            src='/images/Icon.svg'
                            alt='search'
                        />
                        <input
                            className={styles['form-input']}
                            type='search'
                            placeholder='Buscar...'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <img className={styles['box-image']} src='/images/Notificação.svg' alt='Notificação' />
                    <img className={styles['box-image']} src='/images/Noturno.svg' alt='Modo Noturno' />
                    <img className={styles['box-image']} src='/images/Configuração.svg' alt='Configuração' />
                    <img className={styles['box-image']} src='/images/Perfil Nav Bar.svg' alt='Perfil Nav Bar' />
                </div>
            </div>
        </>
    );
}

export default Header;
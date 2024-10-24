import React from 'react';
import styles from './Header.module.css';

function Header() {
    return (
        <>
            <div className={styles.head}>
                <h3 className={styles['head-title']}>Dashboard</h3>
                <div className={styles['container']}>
                    <div className={styles.info}>
                        <img className={styles['search-icon']} src='/images/Icon.svg' alt='search' />
                        <input
                            className={styles['form-input']}
                            type='search'
                            placeholder='Buscar...'
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
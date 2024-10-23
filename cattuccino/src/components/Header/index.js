import React from 'react';
import styles from './Header.module.css';

function Header() {
    return (
        <>
            <div className={styles.head}>
                <h3 className={styles['head-title']}>Dashboard</h3>
            </div>
        </>
    );
}

export default Header;
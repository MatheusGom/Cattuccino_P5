import React from "react";
import styles from './Dashboard.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    return(
        <> 
            <Header />
            <Sidebar />
                <div className={styles.dashboard}>
                </div>
        </>
    );
}

export default Dashboard;
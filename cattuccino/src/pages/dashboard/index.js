import React from "react";
import styles from './Dashboard.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    return(
        <> 
            <Header />
            <Sidebar />
            <div classNames={styles.container}>
            </div>
        </>
    );
}

export default Dashboard;
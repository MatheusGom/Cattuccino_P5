import React from "react";
import { useParams } from "react-router-dom";
import styles from './Dashboard.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    const { userType } = useParams();
    return (
        <>
            <Header />
            <Sidebar userType={userType} />
            <div className={styles.dashboard}>
            </div>
        </>
    );
}

export default Dashboard;
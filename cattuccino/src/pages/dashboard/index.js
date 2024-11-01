import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from './Dashboard.module.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    const { userType } = useParams();
    const [activeButton, setActiveButton] = useState('home');
    return (
        <>
            <Header activeButton={activeButton} />
            <Sidebar userType={userType} activeButton={activeButton} setActiveButton={setActiveButton}/>
            <div className={styles.dashboard}>
            </div>
        </>
    );
}

export default Dashboard;
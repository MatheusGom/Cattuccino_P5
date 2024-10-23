// src/pages/Financial.js
import React from 'react';
import { useParams } from 'react-router-dom';
//import styles from './Financial.module.css';
import Sidebar from '../../components/Sidebar';
import InitialBackground from '../../components/InitialBackground';

const Financial = () => {
    const { userType } = useParams();

    return (
        <>
            <InitialBackground/>
            <div>
                <Sidebar userType={userType} />
                <div>
                    <p>Conteúdo específico para {userType} pode ser exibido aqui.</p>
                </div>
            </div>
        </>
    );
};

export default Financial;

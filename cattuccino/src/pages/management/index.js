import React from 'react';
import { useParams } from 'react-router-dom';
//import styles from './Management.module.css';
import Sidebar from '../../components/Sidebar';

const Management = () => {
    const { userType } = useParams();

    return (
        <>
            <div>
                <Sidebar userType={userType} />
                <div>
                    <p>Conteúdo específico para {userType} pode ser exibido aqui.</p>
                </div>
            </div>
        </>
    );
};

export default Management;

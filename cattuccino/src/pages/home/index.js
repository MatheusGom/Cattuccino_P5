import React from 'react';
import { useParams } from 'react-router-dom';
//import styles from './Home.module.css';
import Sidebar from '../../components/Sidebar';

const Home = () => {
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

export default Home;

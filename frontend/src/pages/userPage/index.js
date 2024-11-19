import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import styles from './UserPage.module.css';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { userType } = useParams();
    const [activeButton, setActiveButton] = useState('management');
    const navigate = useNavigate();

    useEffect(() => {
        if (userType !== '2') {
            alert('Acesso negado! Você não tem permissão para acessar esta página.');
            navigate('/');
        } else {
            fetchUsuarios();
        }
    }, [userType, navigate]);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios');
            if (response.data && Array.isArray(response.data)) {
                console.log('Dados recebidos:', response.data);
                setUsuarios(response.data);
            } else {
                console.error('Formato inesperado de dados:', response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar os usuários:', error);
            alert('Erro ao buscar os usuários. Verifique o console para mais detalhes.');
        }
    };

    return (
        <>
            <div className={styles['users-background']}>
                <Header activeButton={activeButton} />
                <Sidebar userType={userType} activeButton={activeButton} setActiveButton={setActiveButton} />
                <div className={styles['users-body']}>
                    <div className={styles['users-list']}>
                        <div className={styles['add-member-btn']} onClick={() => navigate('/add-member')}>
                            +
                        </div>
                        {usuarios.map(usuario => (
                            <div
                                key={usuario.ID}
                                className={styles['user-item']}
                                onClick={() => setSelectedUser(usuario)}
                            >
                                <p><strong>{usuario.NOME || 'N/A'}</strong></p>
                                <p>{usuario.FORMACAO || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles['user-card']}>
                        {selectedUser ? (
                            <div className={styles.info}>
                                <h2>{selectedUser.NOME}</h2>
                                <p><strong>Idade:</strong> {selectedUser.IDADE || 'N/A'}</p>
                                <p><strong>Localização:</strong> {selectedUser.LOCALIZACAO || 'N/A'}</p>
                                <p><strong>Tipo Sanguíneo:</strong> {selectedUser.TIPO_SANGUINEO || 'N/A'}</p>
                                <p><strong>Formação:</strong> {selectedUser.FORMACAO || 'N/A'}</p>
                                <p><strong>Data de Nascimento:</strong> {selectedUser.DT_NASCIMENTO || 'N/A'}</p>
                                <p><strong>Cor:</strong> {selectedUser.COR || 'N/A'}</p>
                                <p><strong>Gênero:</strong> {selectedUser.GENERO || 'N/A'}</p>
                                <p><strong>Data de Admissão:</strong> {selectedUser.DT_ADMISSAO || 'N/A'}</p>
                            </div>
                        ) : (
                            <p>Selecione um usuário para ver os detalhes.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UsuariosPage;

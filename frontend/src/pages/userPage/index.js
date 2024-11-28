import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import styles from './UserPage.module.css';
import { FaPaw } from 'react-icons/fa';

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

    const renderPaws = (rating, maxRating = 5) => {
        return (
            <div className={styles['paws']}>
                {[...Array(maxRating)].map((_, index) => (
                    <img
                        key={index}
                        src={rating > index ? '/images/full_paw.svg' : '/images/empty_paw.svg'}
                        alt="Paw Icon"
                        className={styles['rating-icon']}
                    />
                ))}
            </div>
        );
    };

    const getAttributeLabel = (attribute, genero) => {
        if (genero === 'Masculino') {
            return attribute;
        } else if (genero === 'Feminino') {
            return attribute.replace('Extrovertido', 'Extrovertida')
                .replace('Criativo', 'Criativa')
                .replace('Ocupado', 'Ocupada')
                .replace('Organizado', 'Organizada')
                .replace('Tranquilo', 'Tranquila');
        } else {
            return attribute.replace('Extrovertido', 'Extrovertide')
                .replace('Criativo', 'Criative')
                .replace('Ocupado', 'Ocupade')
                .replace('Organizado', 'Organizade')
                .replace('Tranquilo', 'Tranquile');
        }
    };

    return (
        <>
            <Header activeButton={activeButton} />
            <div className={styles['users-background']}>
                <Sidebar userType={userType} activeButton={activeButton} setActiveButton={setActiveButton} />
                <div className={styles['users-body']}>
                    <div className={styles['users-list']}>
                        <div className={styles['add-container']}>
                            <h2>Adicionar membro</h2>
                            <div className={styles['add-member-btn']} onClick={() => navigate('/dashboard/2/usuarios/novo')}>
                                <img src='/images/addBtn.svg' alt="Botão para adicionar novo funcionário" />
                            </div>
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
                                <p className={styles['card-subtitle']}>{selectedUser.GERENCIA === 1 ? 'Gerente' : 'Funcionário'}</p>
                                <div className={styles['card-content']}>
                                    <div>
                                        <p><strong>Idade:</strong> {selectedUser.IDADE || 'N/A'}</p>
                                        <p><strong>Localização:</strong> {selectedUser.LOCALIZACAO || 'N/A'}</p>
                                        <p><strong>Tipo Sanguíneo:</strong> {selectedUser.TIPO_SANGUINEO || 'N/A'}</p>
                                        <p><strong>Formação:</strong> {selectedUser.FORMACAO || 'N/A'}</p>
                                        <p><strong>Data de Nascimento:</strong> {selectedUser.DT_NASCIMENTO || 'N/A'}</p>
                                        <p><strong>Cor:</strong> {selectedUser.COR || 'N/A'}</p>
                                        <p><strong>Gênero:</strong> {selectedUser.GENERO || 'N/A'}</p>
                                        <p><strong>Data de Admissão:</strong> {selectedUser.DT_ADMISSAO || 'N/A'}</p>
                                    </div>
                                    <div className={styles['user-ratings']}>
                                        <p><strong>{getAttributeLabel('Extrovertido', selectedUser.GENERO)}:</strong> {renderPaws(selectedUser.EXTROVERTID)}</p>
                                        <p><strong>{getAttributeLabel('Criativo', selectedUser.GENERO)}:</strong> {renderPaws(selectedUser.CRIATIV)}</p>
                                        <p><strong>{getAttributeLabel('Ocupado', selectedUser.GENERO)}:</strong> {renderPaws(selectedUser.OCUPAD)}</p>
                                        <p><strong>{getAttributeLabel('Organizado', selectedUser.GENERO)}:</strong> {renderPaws(selectedUser.ORGANIZAD)}</p>
                                        <p><strong>{getAttributeLabel('Tranquilo', selectedUser.GENERO)}:</strong> {renderPaws(selectedUser.TRANQUIL)}</p>
                                    </div>
                                </div>
                                <div className={styles['button-container']}>
                                    <button className={styles['card-button']}>
                                        Excluir Membro
                                        <div className={styles['image-btn']}>
                                            <img src='/images/trashCan.svg' alt='Botão para excluir usuário' />
                                        </div>
                                    </button>
                                    <button className={styles['card-button']}>
                                        Editar Membro
                                        <div className={styles['image-btn']}>
                                            <img src='/images/pencil.svg' alt='Botão para editar usuário' />
                                        </div>
                                    </button>
                                </div>
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

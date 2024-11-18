import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios');  // Certifique-se de que essa URL está correta.
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
        <div>
            <h1>Lista de Usuários</h1>
            {usuarios.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <ul>
                    {usuarios.map(usuario => (
                        <li key={usuario.ID}>
                            <strong>Nome:</strong> {usuario.NOME || 'N/A'} <br />
                            <strong>Email:</strong> {usuario.EMAIL || 'N/A'} <br />
                            <strong>Idade:</strong> {usuario.IDADE || 'N/A'} <br />
                            <strong>Localização:</strong> {usuario.LOCALIZACAO || 'N/A'} <br />
                            <strong>Tipo Sanguíneo:</strong> {usuario.TIPO_SANGUINEO || 'N/A'} <br />
                            <strong>Formação:</strong> {usuario.FORMACAO || 'N/A'} <br />
                            <strong>Data de Nascimento:</strong> {usuario.DT_NASCIMENTO || 'N/A'} <br />
                            <strong>Cor:</strong> {usuario.COR || 'N/A'} <br />
                            <strong>Gênero:</strong> {usuario.GENERO || 'N/A'} <br />
                            <strong>Data de Admissão:</strong> {usuario.DT_ADMISSAO || 'N/A'} <br />
                            <strong>Extrovertido:</strong> {usuario.EXTROVERTID || 'N/A'} <br />
                            <strong>Criativo:</strong> {usuario.CRIATIV || 'N/A'} <br />
                            <strong>Ocupado:</strong> {usuario.OCUPAD || 'N/A'} <br />
                            <strong>Organizado:</strong> {usuario.ORGANIZAD || 'N/A'} <br />
                            <strong>Tranquilo:</strong> {usuario.TRANQUIL || 'N/A'} <br />
                            <strong>Gerência:</strong> {usuario.GERENCIA || 'N/A'} <br />
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsuariosPage;

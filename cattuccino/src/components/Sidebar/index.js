import React from 'react';
// import styles from './Sidebar.module.css' TIRA ESSE COMENTARIO NA HORA DE USAR O CSS

function Sidebar({ userType }) {
    return (
        <div className="sidebar">
            <h1> AQUI É A SIDEBAR</h1>
            <ul>
                <li>A</li>
                <li>B</li>
                {userType === 'Manager' && (
                    <>
                        <li>Gerente legal 1</li>
                        <li>Pamonha 2</li>
                    </>
                )}
            </ul>
        </div>
    );
}
export default Sidebar;
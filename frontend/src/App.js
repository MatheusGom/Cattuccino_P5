import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Dashboard from './pages/dashboard';
import UsuariosPage from './pages/userPage';
import InserirUsuarioPage from './pages/insertUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/usuario/:userType' element={<UserLogin />} />
        <Route path='/dashboard/:userType/:type' element={<Dashboard />} />
        <Route path='/dashboard/usuarios' element={<UsuariosPage />} />
        <Route path='/dashboard/usuarios/novo' element={<InserirUsuarioPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Dashboard from './pages/dashboard';
import UsuariosPage from './pages/userPage';
import InserirUsuarioPage from './pages/insertUser';
import MarketingPage from './components/MarketingPage';
import InsertData from './pages/insertData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/usuario/:userType' element={<UserLogin />} />
        <Route path='/dashboard/:userType/:type' element={<Dashboard />} />
        <Route path='/dashboard/:userType/usuarios' element={<UsuariosPage />} />
        <Route path='/dashboard/:userType/usuarios/novo' element={<InserirUsuarioPage />} />
        <Route path='/dashboard/:userType/dados/novo' element={<InsertData />} />
        <Route path='/dashboard/marketing/grafico' element={<MarketingPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

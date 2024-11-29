import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Dashboard from './pages/dashboard';
import UsuariosPage from './pages/userPage';
import MarketingPage from './pages/MarketingPage';
import InsertData from './pages/insertData';
import InsertUser from './pages/insertUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/usuario/:userType' element={<UserLogin />} />
        <Route path='/dashboard/:userType' element={<Dashboard />} />
        <Route path='/dashboard/:userType/usuarios' element={<UsuariosPage />} />
        <Route path='/dashboard/:userType/usuarios/novo' element={<InsertUser />} />
        <Route path='/dashboard/:userType/dados/novo' element={<InsertData />} />
        <Route path='/dashboard/:userType/marketing' element={<MarketingPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

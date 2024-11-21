import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Dashboard from './pages/dashboard';
import UsuariosPage from './pages/userPage';
import InserirUsuarioPage from './pages/insertUser';
import InserirMarketingPage from './pages/insertMarketing';
import InserirFinanceiroPage from './pages/insertFinancial';
import MarketingPage from './components/MarketingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/usuario/:userType' element={<UserLogin />} />
        <Route path='/dashboard/:userType/:type' element={<Dashboard />} />
        <Route path='/dashboard/usuarios' element={<UsuariosPage />} />
        <Route path='/dashboard/usuarios/novo' element={<InserirUsuarioPage />} />
        <Route path='/dashboard/financeiro/novo' element={<InserirFinanceiroPage />} />
        <Route path='/dashboard/marketing/novo' element={<InserirMarketingPage />} />
        <Route path='/dashboard/marketing/grafico' element={<MarketingPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

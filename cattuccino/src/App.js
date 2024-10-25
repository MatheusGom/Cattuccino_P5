import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Home from './pages/home';
import Financial from './pages/financial';
import Marketing from './pages/marketing';
import Management from './pages/management';
import Profile from './pages/profile';
import Configurations from './pages/configurations';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/usuario/:userType' element={<UserLogin/>}/>
        <Route path="/home/:userType" element={<Home />} />
        <Route path="/financeiro/:userType" element={<Financial />} />
        <Route path="/marketing/:userType" element={<Marketing />} />
        <Route path="/gerenciamento/:userType" element={<Management />} />
        <Route path="/perfil/:userType" element={<Profile />} />
        <Route path="/configuracoes/:userType" element={<Configurations />} />
      </Routes>
    </Router>
  );
}

export default App;

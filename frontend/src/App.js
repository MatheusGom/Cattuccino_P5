import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/usuario/:userType' element={<UserLogin />} />
        <Route path='/dashboard/:userType/:type' element={< Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;

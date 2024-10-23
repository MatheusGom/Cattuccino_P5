import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';
import Financial from './pages/financial';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/usuario/:userType' element={<UserLogin/>}/>
        <Route path="/financeiro/:userType" element={<Financial />} />
      </Routes>
    </Router>
  );
}

export default App;

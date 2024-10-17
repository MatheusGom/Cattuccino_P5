import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/login";
import UserLogin from './pages/userLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/usuario' element={<UserLogin/>}/>
      </Routes>
    </Router>
  );
}

export default App;

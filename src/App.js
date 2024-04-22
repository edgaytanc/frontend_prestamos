import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Usuarios from './views/Usuarios';
import Proveedores from './views/Proveedores';
import Prestamos from './views/Prestamos';
import Documentos from './views/Docmentos';
import Contrasenas from './views/Contrasenas';
import MetodosDePago from './views/Metodosdepago';
// Importar otros componentes de vista aquí

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Navigate replace to="/login" />} />
        <Route path="/dashboard/*" element={isLoggedIn ? <Dashboard /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

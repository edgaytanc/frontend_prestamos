import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para almacenar errores
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realiza la peticion POST al api
      const response = await axios.post('https://localhost:7190/api/usuarios/login', {
        nombreUsuario: username,
        Contrasena: password
      });
      console.log(response.data); // Maneja la respuesta
      if (response.data) { // Asumiendo que el backend responde con datos de usuario o token
        setIsLoggedIn(true); // Actualiza el estado de autenticación
        navigate('/dashboard'); // Redirige al usuario al Dashboard
      }
    } catch (error) {
      // Manejo de errores de la petición
      if (error.response) {
        // La petición fue hecha y el servidor respondió con un código de estado
        // que no está en el rango de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setError('Usuario o contraseña incorrectos');
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.log(error.request);
        setError('Error de red o servidor no disponible');
      } else {
        // Algo ocurrió en la configuración de la petición que lanzó un Error
        console.log('Error', error.message);
        setError('Error al hacer la petición');
      }
    }
    console.log(username, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;

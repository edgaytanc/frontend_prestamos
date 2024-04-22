import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// Estilos para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [contrasena, setContrasena] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Hubo un error al recuperar los datos de los usuarios:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentUser(null);
    setNombreUsuario('');
    setIdProveedor('');
    setContrasena('');
    setModalOpen(true);
  };

  const handleActualizar = (usuario) => {
    setCurrentUser(usuario);
    setNombreUsuario(usuario.nombreUsuario);
    setIdProveedor(usuario.idProveedor.toString()); // Asegúrate de convertirlo a string si es necesario
    setContrasena(usuario.contrasena);
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/usuarios/${id}`);
      cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      // Incluye idUsuario solo si estás actualizando, no al crear uno nuevo
      ...(currentUser && { idUsuario: currentUser.idUsuario }),
      nombreUsuario,
      idProveedor, // Asegúrate de que el ID del proveedor es el que se envía
      contrasena,
    };
  
    try {
      if (currentUser) {
        await axios.put(`https://localhost:7190/api/usuarios/${currentUser.idUsuario}`, userData);
      } else {
        await axios.post('https://localhost:7190/api/usuarios', userData);
      }
      setModalOpen(false);
      cargarUsuarios();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };
  

  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentUser ? 'Actualizar Usuario' : 'Agregar Usuario'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre Usuario"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Proveedor"
          value={idProveedor}
          onChange={(e) => setIdProveedor(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentUser ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        MANTENIMIENTO DE USUARIOS
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de usuarios">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Usuario</TableCell>
              <TableCell>ID Proveedor</TableCell>
              <TableCell>Contraseña</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.idUsuario}>
                <TableCell>{usuario.idUsuario}</TableCell>
                <TableCell>{usuario.nombreUsuario}</TableCell>
                <TableCell>{usuario.idProveedor}</TableCell>
                <TableCell>{"******"}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(usuario)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(usuario.idUsuario)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {bodyModal}
      </Modal>
    </Box>
  );
}

export default Usuarios;

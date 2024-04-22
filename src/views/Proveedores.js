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

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [nit, setNit] = useState('');

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al recuperar los datos de los proveedores:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentProveedor(null);
    setNombre('');
    setDireccion('');
    setEmail('');
    setNit('');
    setModalOpen(true);
  };

  const handleActualizar = (proveedor) => {
    setCurrentProveedor(proveedor);
    setNombre(proveedor.nombre);
    setDireccion(proveedor.direccion);
    setEmail(proveedor.email);
    setNit(proveedor.nit);
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/proveedores/${id}`);
      cargarProveedores();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const proveedorData = {
      ...(currentProveedor && { idProveedor: currentProveedor.idProveedor }),
      nombre,
      direccion,
      email,
      nit,
    };

    try {
      if (currentProveedor) {
        await axios.put(`https://localhost:7190/api/proveedores/${currentProveedor.idProveedor}`, proveedorData);
      } else {
        await axios.post('https://localhost:7190/api/proveedores', proveedorData);
      }
      setModalOpen(false);
      cargarProveedores();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    }
  };

  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentProveedor ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="NIT"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentProveedor ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        MANTENIMIENTO DE PROVEEDORES
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de proveedores">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow key={proveedor.idProveedor}>
                <TableCell>{proveedor.idProveedor}</TableCell>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.direccion}</TableCell>
                <TableCell>{proveedor.email}</TableCell>
                <TableCell>{proveedor.nit}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(proveedor)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(proveedor.idProveedor)} />
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

export default Proveedores;

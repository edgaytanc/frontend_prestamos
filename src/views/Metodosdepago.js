import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Modal, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
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

function MetodosDePago() {
  const [metodosDePago, setMetodosDePago] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMetodo, setCurrentMetodo] = useState(null);
  const [idMetodoPago, setIdMetodoPago] = useState('');
  const [idContrasena, setIdContrasena] = useState('');

  useEffect(() => {
    cargarMetodosDePago();
  }, []);

  const cargarMetodosDePago = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/metodosdepago');
      setMetodosDePago(response.data);
    } catch (error) {
      console.error('Error al cargar los métodos de pago:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentMetodo(null);
    setIdMetodoPago('');
    setIdContrasena('');
    setModalOpen(true);
  };

  const handleActualizar = (metodo) => {
    setCurrentMetodo(metodo);
    setIdMetodoPago(metodo.idMetodoPago.toString());
    setIdContrasena(metodo.idContrasena.toString());
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/metodosdepago/${id}`);
      cargarMetodosDePago();
    } catch (error) {
      console.error('Error al eliminar el método de pago:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodoData = {
      idPago: currentMetodo ? currentMetodo.idPago : null, // Asegura que el idPago está presente para la actualización
      idMetodoPago: parseInt(idMetodoPago),
      idContrasena: parseInt(idContrasena),
    };

    try {
      if (currentMetodo) {
        // Utiliza PUT para actualizar el registro existente
        await axios.put(`https://localhost:7190/api/metodosdepago/${currentMetodo.idPago}`, metodoData);
      } else {
        // Utiliza POST para crear un nuevo registro
        await axios.post('https://localhost:7190/api/metodosdepago', metodoData);
      }
      setModalOpen(false);
      cargarMetodosDePago(); // Recargar los datos después de la operación
    } catch (error) {
      console.error('Error al guardar el método de pago:', error);
    }
  };


  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentMetodo ? 'Actualizar Método de Pago' : 'Agregar Método de Pago'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Método de Pago"
          value={idMetodoPago}
          onChange={(e) => setIdMetodoPago(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Contraseña"
          value={idContrasena}
          onChange={(e) => setIdContrasena(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentMetodo ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        Mantenimiento de Métodos de Pago
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de métodos de pago">
          <TableHead>
            <TableRow>
              <TableCell>ID Pago</TableCell>
              <TableCell>ID Método de Pago</TableCell>
              <TableCell>ID Contraseña</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metodosDePago.map((metodo) => (
              <TableRow key={metodo.idPago}>
                <TableCell>{metodo.idPago}</TableCell>
                <TableCell>{metodo.idMetodoPago}</TableCell>
                <TableCell>{metodo.idContrasena}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(metodo)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(metodo.idPago)} />
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

export default MetodosDePago;

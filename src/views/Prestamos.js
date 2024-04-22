import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

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

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPrestamo, setCurrentPrestamo] = useState(null);
  const [idProveedor, setIdProveedor] = useState('');
  const [monto, setMonto] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [plazo, setPlazo] = useState('');
  const [fechaSolicitud, setFechaSolicitud] = useState('');
  const [fechaDesembolso, setFechaDesembolso] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/prestamos');
      setPrestamos(response.data);
    } catch (error) {
      console.error('Hubo un error al recuperar los datos de los préstamos:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentPrestamo(null);
    setIdProveedor('');
    setMonto('');
    setTasaInteres('');
    setPlazo('');
    setFechaSolicitud('');
    setFechaDesembolso('');
    setEstado('');
    setModalOpen(true);
  };

  const handleActualizar = (prestamo) => {
    setCurrentPrestamo(prestamo);
    setIdProveedor(prestamo.idProveedor.toString());
    setMonto(prestamo.monto.toString());
    setTasaInteres(prestamo.tasaInteres.toString());
    setPlazo(prestamo.plazo.toString());
    setFechaSolicitud(prestamo.fechaSolicitud);
    setFechaDesembolso(prestamo.fechaDesembolso);
    setEstado(prestamo.estado);
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/prestamos/${id}`);
      cargarPrestamos();
    } catch (error) {
      console.error('Error al eliminar el préstamo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prestamoData = {
      ...(currentPrestamo && { idPrestamo: currentPrestamo.idPrestamo }), // Agregar idPrestamo solo si estamos actualizando
      idProveedor: parseInt(idProveedor),
      monto: parseFloat(monto),
      tasaInteres: parseFloat(tasaInteres),
      plazo: parseInt(plazo),
      fechaSolicitud,
      fechaDesembolso,
      estado,
    };

    try {
      if (currentPrestamo) {
        await axios.put(`https://localhost:7190/api/prestamos/${currentPrestamo.idPrestamo}`, prestamoData);
      } else {
        await axios.post('https://localhost:7190/api/prestamos', prestamoData);
      }
      setModalOpen(false);
      cargarPrestamos();
    } catch (error) {
      console.error('Error al guardar el préstamo:', error);
    }
};


  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentPrestamo ? 'Actualizar Préstamo' : 'Agregar Préstamo'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Proveedor"
          type="number"
          value={idProveedor}
          onChange={(e) => setIdProveedor(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Monto"
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Tasa de Interés"
          type="number"
          value={tasaInteres}
          onChange={(e) => setTasaInteres(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Plazo"
          type="number"
          value={plazo}
          onChange={(e) => setPlazo(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Fecha de Solicitud"
          type="date"
          value={fechaSolicitud}
          onChange={(e) => setFechaSolicitud(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Fecha de Desembolso"
          type="date"
          value={fechaDesembolso}
          onChange={(e) => setFechaDesembolso(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentPrestamo ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        MANTENIMIENTO DE PRÉSTAMOS
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de préstamos">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Proveedor</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Tasa de Interés</TableCell>
              <TableCell>Plazo</TableCell>
              <TableCell>Fecha de Solicitud</TableCell>
              <TableCell>Fecha de Desembolso</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos.map((prestamo) => (
              <TableRow key={prestamo.idPrestamo}>
                <TableCell>{prestamo.idPrestamo}</TableCell>
                <TableCell>{prestamo.idProveedor}</TableCell>
                <TableCell>{prestamo.monto}</TableCell>
                <TableCell>{prestamo.tasaInteres}</TableCell>
                <TableCell>{prestamo.plazo}</TableCell>
                <TableCell>{prestamo.fechaSolicitud}</TableCell>
                <TableCell>{prestamo.fechaDesembolso}</TableCell>
                <TableCell>{prestamo.estado}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(prestamo)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(prestamo.idPrestamo)} />
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

export default Prestamos;

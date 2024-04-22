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

function Contrasenas() {
  const [contrasenas, setContrasenas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContrasena, setCurrentContrasena] = useState(null);
  const [idPago, setIdPago] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [datosDeFactura, setDatosDeFactura] = useState('');
  const [nombre, setNombre] = useState('');
  const [moneda, setMoneda] = useState('');
  const [canalDePago, setCanalDePago] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [fechaDeVencimiento, setFechaDeVencimiento] = useState('');
  const [retencion, setRetencion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [totalAPagar, setTotalAPagar] = useState('');

  useEffect(() => {
    cargarContrasenas();
  }, []);

  const cargarContrasenas = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/contrasenas');
      setContrasenas(response.data);
    } catch (error) {
      console.error('Error al recuperar los datos de las contraseñas:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentContrasena(null);
    setIdPago('');
    setIdProveedor('');
    setDatosDeFactura('');
    setNombre('');
    setMoneda('');
    setCanalDePago('');
    setFecha('');
    setHora('');
    setFechaDeVencimiento('');
    setRetencion('');
    setDireccion('');
    setTotalAPagar('');
    setModalOpen(true);
  };

  const handleActualizar = (contrasena) => {
    setCurrentContrasena(contrasena);
    setIdPago(contrasena.idPago.toString());
    setIdProveedor(contrasena.idProveedor.toString());
    setDatosDeFactura(contrasena.datosDeFactura);
    setNombre(contrasena.nombre);
    setMoneda(contrasena.moneda);
    setCanalDePago(contrasena.canalDePago);
    setFecha(contrasena.fecha);
    setHora(contrasena.hora);
    setFechaDeVencimiento(contrasena.fechaDeVencimiento);
    setRetencion(contrasena.retencion.toString());
    setDireccion(contrasena.direccion);
    setTotalAPagar(contrasena.totalAPagar.toString());
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/contrasenas/${id}`);
      cargarContrasenas();
    } catch (error) {
      console.error('Error al eliminar la contraseña:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contrasenaData = {
      ...(currentContrasena && { idContrasena: currentContrasena.idContrasena }),
      idPago: parseInt(idPago),
      idProveedor: parseInt(idProveedor),
      datosDeFactura,
      nombre,
      moneda,
      canalDePago,
      fecha,
      hora,
      fechaDeVencimiento,
      retencion: parseFloat(retencion),
      direccion,
      totalAPagar: parseFloat(totalAPagar)
    };

    try {
      if (currentContrasena) {
        await axios.put(`https://localhost:7190/api/contrasenas/${currentContrasena.idContrasena}`, contrasenaData);
      } else {
        await axios.post('https://localhost:7190/api/contrasenas', contrasenaData);
      }
      setModalOpen(false);
      cargarContrasenas();
    } catch (error) {
      console.error('Error al guardar la contraseña:', error);
    }
  };

  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentContrasena ? 'Actualizar Contraseña' : 'Agregar Contraseña'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Pago"
          type="number"
          value={idPago}
          onChange={(e) => setIdPago(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="ID Proveedor"
          type="number"
          value={idProveedor}
          onChange={(e) => setIdProveedor(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Datos de Factura"
          value={datosDeFactura}
          onChange={(e) => setDatosDeFactura(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Moneda"
          value={moneda}
          onChange={(e) => setMoneda(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Canal de Pago"
          value={canalDePago}
          onChange={(e) => setCanalDePago(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Fecha de Vencimiento"
          type="date"
          value={fechaDeVencimiento}
          onChange={(e) => setFechaDeVencimiento(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Retención"
          type="number"
          value={retencion}
          onChange={(e) => setRetencion(e.target.value)}
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
          label="Total a Pagar"
          type="number"
          value={totalAPagar}
          onChange={(e) => setTotalAPagar(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentContrasena ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        MANTENIMIENTO DE CONTRASEÑAS
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de contraseñas">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Pago</TableCell>
              <TableCell>ID Proveedor</TableCell>
              <TableCell>Datos de Factura</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Canal de Pago</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Fecha de Vencimiento</TableCell>
              <TableCell>Retención</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Total a Pagar</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contrasenas.map((contrasena) => (
              <TableRow key={contrasena.idContrasena}>
                <TableCell>{contrasena.idContrasena}</TableCell>
                <TableCell>{contrasena.idPago}</TableCell>
                <TableCell>{contrasena.idProveedor}</TableCell>
                <TableCell>{contrasena.datosDeFactura}</TableCell>
                <TableCell>{contrasena.nombre}</TableCell>
                <TableCell>{contrasena.moneda}</TableCell>
                <TableCell>{contrasena.canalDePago}</TableCell>
                <TableCell>{contrasena.fecha}</TableCell>
                <TableCell>{contrasena.hora}</TableCell>
                <TableCell>{contrasena.fechaDeVencimiento}</TableCell>
                <TableCell>{contrasena.retencion}</TableCell>
                <TableCell>{contrasena.direccion}</TableCell>
                <TableCell>{contrasena.totalAPagar}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(contrasena)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(contrasena.idContrasena)} />
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

export default Contrasenas;

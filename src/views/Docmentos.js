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

function Documentos() {
  const [documentos, setDocumentos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [encabezado, setEncabezado] = useState('');
  const [detalle, setDetalle] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [moneda, setMoneda] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    try {
      const response = await axios.get('https://localhost:7190/api/documentos');
      setDocumentos(response.data);
    } catch (error) {
      console.error('Hubo un error al recuperar los datos de los documentos:', error);
    }
  };

  const handleAgregar = () => {
    setCurrentDocumento(null);
    setTipoDocumento('');
    setEncabezado('');
    setDetalle('');
    setNumeroDocumento('');
    setNumeroSerie('');
    setCantidad('');
    setMoneda('');
    setEstado('');
    setModalOpen(true);
  };

  const handleActualizar = (documento) => {
    setCurrentDocumento(documento);
    setTipoDocumento(documento.tipoDocumento);
    setEncabezado(documento.encabezado);
    setDetalle(documento.detalle);
    setNumeroDocumento(documento.numeroDocumento);
    setNumeroSerie(documento.numeroSerie);
    setCantidad(documento.cantidad.toString());
    setMoneda(documento.moneda);
    setEstado(documento.estado);
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`https://localhost:7190/api/documentos/${id}`);
      cargarDocumentos();
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const documentoData = {
      ...(currentDocumento && { idDocumento: currentDocumento.idDocumento }),
      tipoDocumento,
      encabezado,
      detalle,
      numeroDocumento,
      numeroSerie,
      cantidad: parseFloat(cantidad),
      moneda,
      estado,
    };

    try {
      if (currentDocumento) {
        await axios.put(`https://localhost:7190/api/documentos/${currentDocumento.idDocumento}`, documentoData);
      } else {
        await axios.post('https://localhost:7190/api/documentos', documentoData);
      }
      setModalOpen(false);
      cargarDocumentos();
    } catch (error) {
      console.error('Error al guardar el documento:', error);
    }
  };

  const bodyModal = (
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        {currentDocumento ? 'Actualizar Documento' : 'Agregar Documento'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Tipo de Documento"
          value={tipoDocumento}
          onChange={(e) => setTipoDocumento(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Encabezado"
          value={encabezado}
          onChange={(e) => setEncabezado(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Detalle"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Número de Documento"
          value={numeroDocumento}
          onChange={(e) => setNumeroDocumento(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Número de Serie"
          value={numeroSerie}
          onChange={(e) => setNumeroSerie(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
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
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {currentDocumento ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        MANTENIMIENTO DE DOCUMENTOS
      </Typography>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de documentos">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tipo de Documento</TableCell>
              <TableCell>Encabezado</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Número de Documento</TableCell>
              <TableCell>Número de Serie</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.map((documento) => (
              <TableRow key={documento.idDocumento}>
                <TableCell>{documento.idDocumento}</TableCell>
                <TableCell>{documento.tipoDocumento}</TableCell>
                <TableCell>{documento.encabezado}</TableCell>
                <TableCell>{documento.detalle}</TableCell>
                <TableCell>{documento.numeroDocumento}</TableCell>
                <TableCell>{documento.numeroSerie}</TableCell>
                <TableCell>{documento.cantidad}</TableCell>
                <TableCell>{documento.moneda}</TableCell>
                <TableCell>{documento.estado}</TableCell>
                <TableCell align="right">
                  <Button startIcon={<EditIcon />} onClick={() => handleActualizar(documento)} />
                  <Button startIcon={<DeleteIcon />} onClick={() => handleEliminar(documento.idDocumento)} />
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

export default Documentos;

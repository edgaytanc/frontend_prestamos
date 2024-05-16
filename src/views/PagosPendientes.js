import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography, TextField, Modal, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

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

function PagosPendientes() {
    const [pagos, setPagos] = useState([]);
    const [filteredPagos, setFilteredPagos] = useState([]);
    const [searchDate, setSearchDate] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPagoId, setSelectedPagoId] = useState(null);
    const [metodoPago, setMetodoPago] = useState('');

    useEffect(() => {
        fetchPagosPendientes();
    }, []);

    useEffect(() => {
        if (searchDate) {
            const filtered = pagos.filter(pago =>
                new Date(pago.fechaDeVencimiento).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
            );
            setFilteredPagos(filtered);
        } else {
            setFilteredPagos(pagos);
        }
    }, [searchDate, pagos]);

    const fetchPagosPendientes = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/pagos');
            setPagos(response.data);
            setFilteredPagos(response.data); // Initialize filtered pagos
        } catch (error) {
            console.error('Error al obtener los pagos pendientes:', error);
        }
    };

    const handleOpenModal = (id) => {
        setSelectedPagoId(id);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPagoId(null);
        setMetodoPago('');
    };

    const handlePagar = async () => {
        try {
            await axios.put(`https://localhost:7190/api/pagos/${selectedPagoId}`);
            fetchPagosPendientes();  // Recargar los pagos después de actualizar
            handleCloseModal();
        } catch (error) {
            console.error('Error al pagar el documento:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                PAGOS PENDIENTES
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Buscar por fecha de vencimiento"
                    value={searchDate}
                    onChange={(newValue) => {
                        setSearchDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="tabla de pagos pendientes">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Total a Pagar</TableCell>
                            <TableCell>Fecha de Vencimiento</TableCell>
                            <TableCell>Proveedor</TableCell>
                            <TableCell>Tipo de Documento</TableCell>
                            <TableCell>Encabezado</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPagos.map((pago) => (
                            <TableRow key={pago.idContrasena}>
                                <TableCell>{pago.idContrasena}</TableCell>
                                <TableCell>{pago.nombreContrasena}</TableCell>
                                <TableCell>${pago.totalAPagar}</TableCell>
                                <TableCell>{new Date(pago.fechaDeVencimiento).toLocaleDateString()}</TableCell>
                                <TableCell>{pago.nombreProveedor}</TableCell>
                                <TableCell>{pago.tipoDocumento}</TableCell>
                                <TableCell>{pago.encabezado}</TableCell>
                                <TableCell>{pago.estado}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(pago.idContrasena)}
                                    >
                                        Pagar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Método de Pago
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
                        <Select
                            labelId="metodo-pago-label"
                            id="metodo-pago"
                            value={metodoPago}
                            label="Método de Pago"
                            onChange={(e) => setMetodoPago(e.target.value)}
                        >
                            <MenuItem value="Tarjeta Credito">Tarjeta Credito</MenuItem>
                            <MenuItem value="Tranferencia Bancaria">Tranferencia Bancaria</MenuItem>
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handlePagar}
                    >
                        Pagar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default PagosPendientes;

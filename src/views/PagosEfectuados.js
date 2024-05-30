import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import * as XLSX from 'xlsx';

function PagosEfectuados() {
    const [pagosEfectuados, setPagosEfectuados] = useState([]);
    const [filteredPagos, setFilteredPagos] = useState([]);
    const [searchDate, setSearchDate] = useState(null);

    useEffect(() => {
        fetchPagosEfectuados();
    }, []);

    useEffect(() => {
        if (searchDate) {
            const filtered = pagosEfectuados.filter(pago =>
                new Date(pago.fecha).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
            );
            setFilteredPagos(filtered);
        } else {
            setFilteredPagos(pagosEfectuados);
        }
    }, [searchDate, pagosEfectuados]);

    const fetchPagosEfectuados = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/reportes/pagos-efectuados');
            setPagosEfectuados(response.data);
            setFilteredPagos(response.data); // Initialize filtered pagos
        } catch (error) {
            console.error('Error al obtener los pagos efectuados:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPagos.map(pago => ({
            'Nombre Proveedor': pago.nombreProveedor,
            'ID Contraseña': pago.idContrasena,
            'Nombre Contraseña': pago.nombreContrasena,
            'Fecha': new Date(pago.fecha).toLocaleDateString(),
            'Total a Pagar': pago.totalAPagar,
            'Tipo Documento': pago.tipoDocumento,
            'Encabezado': pago.encabezado,
            'Numero Documento': pago.numeroDocumento,
            'Estado': pago.estado,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PagosEfectuados');
        XLSX.writeFile(workbook, 'PagosEfectuados.xlsx');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                PAGOS EFECTUADOS
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Buscar por fecha"
                        value={searchDate}
                        onChange={(newValue) => {
                            setSearchDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ ml: 2 }}>
                    Exportar a Excel
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="tabla de pagos efectuados">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre Proveedor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Contraseña</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre Contraseña</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Total a Pagar</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo Documento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Encabezado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Numero Documento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPagos.map((pago) => (
                            <TableRow key={pago.idContrasena}>
                                <TableCell>{pago.nombreProveedor}</TableCell>
                                <TableCell>{pago.idContrasena}</TableCell>
                                <TableCell>{pago.nombreContrasena}</TableCell>
                                <TableCell>{new Date(pago.fecha).toLocaleDateString()}</TableCell>
                                <TableCell align="right">Q{pago.totalAPagar}</TableCell>
                                <TableCell>{pago.tipoDocumento}</TableCell>
                                <TableCell>{pago.encabezado}</TableCell>
                                <TableCell>{pago.numeroDocumento}</TableCell>
                                <TableCell>{pago.estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default PagosEfectuados;

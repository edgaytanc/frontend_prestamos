import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import * as XLSX from 'xlsx';

function EstadoCuentaProveedor() {
    const [estadoCuenta, setEstadoCuenta] = useState([]);

    useEffect(() => {
        fetchEstadoCuenta();
    }, []);

    const fetchEstadoCuenta = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/reportes/estado-cuenta-proveedor');
            setEstadoCuenta(response.data);
        } catch (error) {
            console.error('Error al obtener el estado de cuenta del proveedor:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(estadoCuenta.map(cuenta => ({
            'Nombre Proveedor': cuenta.nombreProveedor,
            'ID Contraseña': cuenta.idContrasena,
            'Nombre Contraseña': cuenta.nombreContrasena,
            'Fecha': new Date(cuenta.fecha).toLocaleDateString(),
            'Total a Pagar': cuenta.totalAPagar,
            'Tipo Documento': cuenta.tipoDocumento,
            'Encabezado': cuenta.encabezado,
            'Numero Documento': cuenta.numeroDocumento,
            'Estado': cuenta.estado,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'EstadoCuentaProveedor');
        XLSX.writeFile(workbook, 'EstadoCuentaProveedor.xlsx');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                ESTADO DE CUENTA POR PROVEEDOR
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ mb: 2 }}>
                Exportar a Excel
            </Button>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="tabla de estado de cuenta por proveedor">
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
                        {estadoCuenta.map((cuenta) => (
                            <TableRow key={cuenta.idContrasena}>
                                <TableCell>{cuenta.nombreProveedor}</TableCell>
                                <TableCell>{cuenta.idContrasena}</TableCell>
                                <TableCell>{cuenta.nombreContrasena}</TableCell>
                                <TableCell>{new Date(cuenta.fecha).toLocaleDateString()}</TableCell>
                                <TableCell align="right">Q{cuenta.totalAPagar}</TableCell>
                                <TableCell>{cuenta.tipoDocumento}</TableCell>
                                <TableCell>{cuenta.encabezado}</TableCell>
                                <TableCell>{cuenta.numeroDocumento}</TableCell>
                                <TableCell>{cuenta.estado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default EstadoCuentaProveedor;

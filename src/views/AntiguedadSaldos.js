import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import * as XLSX from 'xlsx';

function AntiguedadSaldos() {
    const [antiguedadSaldos, setAntiguedadSaldos] = useState([]);

    useEffect(() => {
        fetchAntiguedadSaldos();
    }, []);

    const fetchAntiguedadSaldos = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/reportes/antiguedad-saldos');
            setAntiguedadSaldos(response.data);
        } catch (error) {
            console.error('Error al obtener la antigüedad de saldos:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(antiguedadSaldos.map(saldo => ({
            'Nombre Proveedor': saldo.nombreProveedor,
            'ID Contraseña': saldo.idContrasena,
            'Fecha': new Date(saldo.fecha).toLocaleDateString(),
            'Fecha de Vencimiento': new Date(saldo.fechaDeVencimiento).toLocaleDateString(),
            'Total a Pagar': saldo.totalAPagar,
            'Días Vencidos': saldo.diasVencidos,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AntiguedadSaldos');
        XLSX.writeFile(workbook, 'AntiguedadSaldos.xlsx');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                ANTIGÜEDAD DE SALDOS
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ mb: 2 }}>
                Exportar a Excel
            </Button>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="tabla de antigüedad de saldos">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre Proveedor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Contraseña</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Vencimiento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Total a Pagar</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Días Vencidos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {antiguedadSaldos.map((saldo) => (
                            <TableRow key={saldo.idContrasena}>
                                <TableCell>{saldo.nombreProveedor}</TableCell>
                                <TableCell>{saldo.idContrasena}</TableCell>
                                <TableCell>{new Date(saldo.fecha).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(saldo.fechaDeVencimiento).toLocaleDateString()}</TableCell>
                                <TableCell align="right">Q{saldo.totalAPagar}</TableCell>
                                <TableCell align="right">{saldo.diasVencidos}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default AntiguedadSaldos;

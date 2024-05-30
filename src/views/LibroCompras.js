import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import * as XLSX from 'xlsx';

function LibroCompras() {
    const [libroCompras, setLibroCompras] = useState([]);

    useEffect(() => {
        fetchLibroCompras();
    }, []);

    const fetchLibroCompras = async () => {
        try {
            const response = await axios.get('https://localhost:7190/api/reportes/libro-compras');
            setLibroCompras(response.data);
        } catch (error) {
            console.error('Error al obtener el libro de compras:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(libroCompras.map(compra => ({
            'ID Documento': compra.idDocumento,
            'Tipo Documento': compra.tipoDocumento,
            'Encabezado': compra.encabezado,
            'Numero Documento': compra.numeroDocumento,
            'Numero Serie': compra.numeroSerie,
            'Cantidad': compra.cantidad,
            'Moneda': compra.moneda,
            'Estado': compra.estado,
            'ID Proveedor': compra.idProveedor,
            'Nombre Proveedor': compra.nombreProveedor,
            'Direccion': compra.direccion,
            'Email': compra.email,
            'NIT': compra.nit,
            'Total A Pagar': compra.totalAPagar,
            'Fecha Vencimiento': new Date(compra.fechaDeVencimiento).toLocaleDateString(),
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'LibroCompras');
        XLSX.writeFile(workbook, 'LibroCompras.xlsx');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom component="div">
                LIBRO DE COMPRAS
            </Typography>
            <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ mb: 2 }}>
                Exportar a Excel
            </Button>
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="tabla de libro de compras">
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID Documento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo Documento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Encabezado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Numero Documento</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Numero Serie</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Cantidad</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Moneda</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Proveedor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre Proveedor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Direccion</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>NIT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Total A Pagar</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha Vencimiento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {libroCompras.map((compra) => (
                            <TableRow key={compra.idDocumento}>
                                <TableCell>{compra.idDocumento}</TableCell>
                                <TableCell>{compra.tipoDocumento}</TableCell>
                                <TableCell>{compra.encabezado}</TableCell>
                                <TableCell>{compra.numeroDocumento}</TableCell>
                                <TableCell>{compra.numeroSerie}</TableCell>
                                <TableCell align="right">{compra.cantidad}</TableCell>
                                <TableCell>{compra.moneda}</TableCell>
                                <TableCell>{compra.estado}</TableCell>
                                <TableCell>{compra.idProveedor}</TableCell>
                                <TableCell>{compra.nombreProveedor}</TableCell>
                                <TableCell>{compra.direccion}</TableCell>
                                <TableCell>{compra.email}</TableCell>
                                <TableCell>{compra.nit}</TableCell>
                                <TableCell align="right">Q{compra.totalAPagar}</TableCell>
                                <TableCell>{new Date(compra.fechaDeVencimiento).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default LibroCompras;

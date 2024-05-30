import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, AppBar, Divider } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Routes, Route, Link } from 'react-router-dom';
import Usuarios from './Usuarios';
import Proveedores from './Proveedores';
import Prestamos from './Prestamos';
import Documentos from './Docmentos'; // Corregido
import Contrasenas from './Contrasenas';
import MetodosDePago from './Metodosdepago'; // Corregido
import PagosPendientes from './PagosPendientes';
import LibroCompras from './LibroCompras';
import AntiguedadSaldos from './AntiguedadSaldos';
import EstadoCuentaProveedor from './EstadoCuentaProveedor';
import PagosEfectuados from './PagosEfectuados';

const drawerWidth = 240;

function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Nombre de la Empresa
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {['Usuarios', 'Proveedores', 'Prestamos', 'Documentos', 'Contrasenas', 'metodosdepago', 'Pagos Pendientes'].map((text, index) => (
                            <ListItem button key={text} component={Link} to={`/dashboard/${text.toLowerCase().replace(' ', '')}`}>
                                <ListItemIcon>
                                    {index === 0 && <PeopleIcon />}
                                    {index === 1 && <BusinessCenterIcon />}
                                    {index === 2 && <AttachMoneyIcon />}
                                    {index === 3 && <DescriptionIcon />}
                                    {index === 4 && <VpnKeyIcon />}
                                    {index === 5 && <AttachMoneyIcon />}
                                    {index === 6 && <AttachMoneyIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <Typography variant="h6">
                                Reportes
                            </Typography>
                        </ListItem>
                        {['librocompras','antiguedad-saldos', 'estado-cuenta-proveedor', 'pagos-efectuados'].map((text, index) => (
                            <ListItem button key={text} component={Link} to={`/dashboard/${text.toLowerCase().replace(' ', '')}`}>
                                <ListItemIcon>
                                    {index === 0 && <AssessmentIcon />}
                                    {index === 1 && <BarChartIcon />}
                                    {index === 2 && <DescriptionIcon/>}
                                    {index === 3 && <AttachMoneyIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Routes>
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="prestamos" element={<Prestamos />} />
                    <Route path="documentos" element={<Documentos />} />
                    <Route path="contrasenas" element={<Contrasenas />} />
                    <Route path="metodosdepago" element={<MetodosDePago />} />
                    <Route path="pagospendientes" element={<PagosPendientes />} />
                    <Route path="librocompras" element={<LibroCompras />} />
                    <Route path="antiguedad-saldos" element={<AntiguedadSaldos />} />
                    <Route path="estado-cuenta-proveedor" element={<EstadoCuentaProveedor />} />
                    <Route path="pagos-efectuados" element={<PagosEfectuados />} />
                    {/* Añadir rutas para otros componentes aquí */}
                </Routes>
            </Box>
        </Box>
    );
}

export default Dashboard;

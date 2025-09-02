import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Pagination,
  Stack
} from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import ReportOffIcon from '@mui/icons-material/ReportOff';
import BarChartIcon from '@mui/icons-material/BarChart';
import Navbar from "../commponents/Navbar";

const API_URL = process.env.REACT_APP_API_URL_PROD;

function ReportesAdmin() {
  const { id: fraccId } = useParams();
  const navigate = useNavigate();
  const [reportes, setReportes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [casa, setCasa] = useState("");
  const [rango, setRango] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReportes, setTotalReportes] = useState(0);
  const [reportesPorPagina] = useState(20);

  const calcularFechas = () => {
    const hoy = dayjs();
    const meses = parseInt(rango);
    const desde = hoy.subtract(meses, 'month').format("YYYY-MM-DD");
    const hasta = hoy.format("YYYY-MM-DD");
    return { desde, hasta };
  };

  const obtenerReportes = async (filtrarPorCasa = false, pagina = 1) => {
    try {
      setLoading(true);
      setError("");

      const { desde, hasta } = calcularFechas();
      
      let url;
      let params = { 
        desde, 
        hasta, 
        limite: reportesPorPagina,
        pagina: pagina,
        ordenar: 'desc' 
      };

      if (filtrarPorCasa && casa && casa.trim() !== "") {
        url = `${API_URL}/api/reportes/${fraccId}/casa/${casa}`;
        console.log("Obteniendo reportes de casa:", casa, "página:", pagina);
      } else {
        url = `${API_URL}/api/reportes/${fraccId}`;
        console.log("Obteniendo TODOS los reportes del fraccionamiento, página:", pagina);
      }

      const response = await axios.get(url, { params });
      
      console.log("Respuesta de reportes:", response.data);

      if (response.data.success) {
        let reportesData = response.data.reportes || [];
        
        // Los reportes ya deberían venir ordenados del backend, pero por seguridad:
        reportesData = reportesData.sort((a, b) => {
          return new Date(b.tiempo) - new Date(a.tiempo);
        });
        
        setReportes(reportesData);
        setEstadisticas(response.data.estadisticas || null);
        
        // Actualizar información de paginación
        setCurrentPage(pagina);
        setTotalReportes(response.data.total || reportesData.length);
        setTotalPages(Math.ceil((response.data.total || reportesData.length) / reportesPorPagina));
        
      } else {
        setError("Error al obtener reportes");
        setReportes([]);
        setTotalReportes(0);
        setTotalPages(1);
      }

    } catch (err) {
      console.error("Error al obtener reportes:", err);
      setError(err.response?.data?.error || "Error de conexión al obtener reportes");
      setReportes([]);
      setTotalReportes(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getEstatusColor = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case 'aceptado':
        return 'success';
      case 'rechazado':
        return 'error';
      case 'expirado':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEstatusLabel = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case 'aceptado':
        return 'ACEPTADO';
      case 'rechazado':
        return 'RECHAZADO';
      case 'expirado':
        return 'EXPIRADO';
      default:
        return estatus?.toUpperCase() || 'PENDIENTE';
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    obtenerReportes(casa && casa.trim() !== "", newPage);
  };

  const handleBuscar = () => {
    setCurrentPage(1); // Reiniciar a página 1 al buscar
    obtenerReportes(true, 1);
  };

  const handleVerTodos = () => {
    setCasa("");
    setCurrentPage(1);
    obtenerReportes(false, 1);
  };

  // Efecto para cargar reportes cuando cambie el período
  useEffect(() => {
    if (fraccId && currentPage > 0) {
      const tieneFiltroCasa = casa && casa.trim() !== "";
      obtenerReportes(tieneFiltroCasa, currentPage);
    }
  }, [rango]); // Solo cuando cambie el rango de fechas

  useEffect(() => {
    if (fraccId) {
      // Cargar TODOS los reportes por defecto, sin filtro de casa
      obtenerReportes(false, 1);
    }
  }, [fraccId]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container sx={{ py: 3, maxWidth: 'xl' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Reportes del Fraccionamiento
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <TextField
              label="Número de Casa (opcional)"
              value={casa}
              onChange={(e) => setCasa(e.target.value)}
              placeholder="Ej: 101"
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={rango}
                label="Período"
                onChange={(e) => setRango(e.target.value)}
              >
                <MenuItem value="1">Último mes</MenuItem>
                <MenuItem value="2">Últimos 2 meses</MenuItem>
                <MenuItem value="3">Últimos 3 meses</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={handleBuscar}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleVerTodos}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Ver Todos
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate(`/dashboard/${fraccId}`)}
              sx={{ minWidth: 120 }}
            >
              ← Volver
            </Button>
          </Box>
        </CardContent>
      </Card>

      {estadisticas && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChartIcon /> Estadísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">{estadisticas.total}</Typography>
                  <Typography variant="body2">Total</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">{estadisticas.aceptados}</Typography>
                  <Typography variant="body2">Aceptados</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">{estadisticas.rechazados}</Typography>
                  <Typography variant="body2">Rechazados</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">{estadisticas.expirados}</Typography>
                  <Typography variant="body2">Expirados</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Casa</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Visitante</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Motivo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha/Hora</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estatus</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Autorizado por</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Foto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(reportes) && reportes.length > 0 ? (
                reportes.map((reporte, index) => (
                  <TableRow 
                    key={reporte._id || index}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:nth-of-type(even)': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Casa {reporte.numeroCasa}
                    </TableCell>
                    <TableCell>{reporte.nombre}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {reporte.motivo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs(reporte.tiempo).format('DD/MM/YYYY')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(reporte.tiempo).format('HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEstatusLabel(reporte.estatus)}
                        color={getEstatusColor(reporte.estatus)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {reporte.autorizadoPor || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {reporte.foto ? (
                        <a href={reporte.foto} target="_blank" rel="noopener noreferrer">
                          <img
                            src={reporte.foto}
                            alt="Foto del visitante"
                            width="50"
                            height="50"
                            style={{ 
                              borderRadius: 8, 
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: '2px solid #ddd'
                            }}
                          />
                        </a>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Sin foto
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
                      <ReportOffIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No hay reportes disponibles
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {casa ? `No se encontraron reportes para la casa ${casa} en el período seleccionado` : 
                               'No se encontraron reportes en el período seleccionado'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {reportes.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {reportes.length} de {totalReportes} reportes (Página {currentPage} de {totalPages})
              </Typography>
              
              <Stack spacing={2}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  showFirstButton 
                  showLastButton
                  disabled={loading}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
      </Container>
    </Box>
  );
}

export default ReportesAdmin;
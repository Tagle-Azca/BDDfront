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
  Box
} from "@mui/material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import ReportOffIcon from '@mui/icons-material/ReportOff';

function ReportesAdmin() {
  const { id: fraccId } = useParams();
  const [reportes, setReportes] = useState([]);
  const [casa, setCasa] = useState("");
  const [rango, setRango] = useState("1");

  const calcularFechas = () => {
    const hoy = dayjs();
    const meses = parseInt(rango);
    const desde = hoy.subtract(meses, 'month').format("YYYY-MM-DD");
    const hasta = hoy.format("YYYY-MM-DD");
    return { desde, hasta };
  };

  const obtenerReportes = async () => {
    try {
      const { desde, hasta } = calcularFechas();
      const params = { desde, hasta };
      if (casa) params.casa = casa;

      const res = await axios.get(`/api/reportes/${fraccId}/reportes`, { params });
      setReportes(res.data.reportes);
    } catch (err) {
      console.error("Error al obtener reportes", err);
    }
  };

  useEffect(() => {
    obtenerReportes();
    // eslint-disable-next-line
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reportes del Fraccionamiento
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="Número de Casa"
          value={casa}
          onChange={(e) => setCasa(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Rango</InputLabel>
          <Select
            value={rango}
            label="Rango"
            onChange={(e) => setRango(e.target.value)}
          >
            <MenuItem value="1">Último mes</MenuItem>
            <MenuItem value="2">Últimos 2 meses</MenuItem>
            <MenuItem value="3">Últimos 3 meses</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={obtenerReportes}>
          Buscar
        </Button>
      </Box>

      <Table>
  <TableHead>
    <TableRow>
      <TableCell>Casa</TableCell>
      <TableCell>Nombre</TableCell>
      <TableCell>Motivo</TableCell>
      <TableCell>Fecha</TableCell>
      <TableCell>Estatus</TableCell>
      <TableCell>Foto</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {Array.isArray(reportes) && reportes.length > 0 ? (
      reportes.map((r, index) => (
        <TableRow key={index}>
          <TableCell>{r.numeroCasa}</TableCell>
          <TableCell>{r.nombre}</TableCell>
          <TableCell>{r.motivo}</TableCell>
          <TableCell>{new Date(r.tiempo).toLocaleString()}</TableCell>
          <TableCell>{r.estatus}</TableCell>
          <TableCell>
            {r.foto ? (
              <a href={r.foto} target="_blank" rel="noopener noreferrer">
                <img
                  src={r.foto}
                  alt="foto"
                  width="60"
                  style={{ borderRadius: 4 }}
                />
              </a>
            ) : (
              "Sin foto"
            )}
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableCell colSpan={6} align="center">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={4}>
          <ReportOffIcon sx={{ fontSize: 50, color: "text.secondary", mb: 1 }} />
          <Typography variant="subtitle1" color="textSecondary">
            No hay reportes disponibles
          </Typography>
        </Box>
      </TableCell>
    )}
  </TableBody>
</Table>
    </Container>
  );
}

export default ReportesAdmin;
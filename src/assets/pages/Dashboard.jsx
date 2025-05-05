import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002";

export default function DashboardFracc() {
  const [data, setData] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(`${API_URL}/api/fracc/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const casas = response.data.residencias || [];

        const dataFormatted = casas.map((casa, index) => ({
          id: index + 1,
          numero: casa.numero,
          propietario: casa.propietario,
          telefono: casa.telefono,
          residentes: casa.residentes.map((res) => ({
            nombre: res.nombre,
            edad: res.edad,
            relacion: res.relacion,
            telefono: res.telefono || "N/A"
          })),
        }));

        setData(dataFormatted);
      } catch (error) {
        console.error("❌ Error al obtener datos del fraccionamiento:", error);
      }
    };

    fetchData();
  }, []);

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Typography variant="h6" gutterBottom component="div">
        Casas del Fraccionamiento
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Número</TableCell>
              <TableCell>Propietario</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell># Residentes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <>
                <TableRow key={row.id}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => toggleRow(row.id)}
                    >
                      {openRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell>{row.propietario}</TableCell>
                  <TableCell>{row.telefono}</TableCell>
                  <TableCell>{row.residentes.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="subtitle1" gutterBottom component="div">
                          Residentes
                        </Typography>
                        <Table size="small" aria-label="residents">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Edad</TableCell>
                              <TableCell>Relación</TableCell>
                              <TableCell>Teléfono</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.residentes.map((res, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{res.nombre}</TableCell>
                                <TableCell>{res.edad}</TableCell>
                                <TableCell>{res.relacion}</TableCell>
                                <TableCell>{res.telefono}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
import { useState, useEffect } from "react";
import React from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002";

export default function DashboardFracc() {
  const [data, setData] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openAddCasa, setOpenAddCasa] = useState(false);
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", edad: "", relacion: "" });
  const [newCasa, setNewCasa] = useState({ numero: "", propietario: "", telefono: "" });

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_URL}/api/fracc/${user._id}`);
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
          telefono: res.telefono || "N/A",
          qrPersonal: res.qrPersonal,
        })),
      }));

      setData(dataFormatted);
    } catch (error) {
      console.error("❌ Error al obtener datos del fraccionamiento:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRow = (id) => setOpenRow(openRow === id ? null : id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCasaChange = (e) => {
    const { name, value } = e.target;
    setNewCasa((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (row) => {
    setSelectedCasa(row);
    setOpenForm(true);
  };

  const handleAddResidente = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        `${API_URL}/api/fracc/${user._id}/casas/${selectedCasa.numero}/residentes`,
        formData
      );
      setOpenForm(false);
      setFormData({ nombre: "", edad: "", relacion: "" });
      fetchData();
    } catch (error) {
      console.error("❌ Error al agregar residente:", error);
    }
  };

  const handleAddCasa = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post(`${API_URL}/api/fracc/${user._id}/casas`, newCasa);
      setNewCasa({ numero: "", propietario: "", telefono: "" });
      setOpenAddCasa(false);
      fetchData();
    } catch (error) {
      console.error("❌ Error al agregar casa:", error);
    }
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 3, md: 5 }, py: 2, maxWidth: "1200px", margin: "0 auto" }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: { xs: 1, sm: 0 } }}>
            Casas del Fraccionamiento
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ whiteSpace: "nowrap" }}
            onClick={() => setOpenAddCasa(true)}
          >
            Agregar Casa
          </Button>
        </Box>
  
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Número</TableCell>
                <TableCell>QR</TableCell>
                <TableCell>Agregar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleRow(row.id)}>
                        {openRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.numero}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const fraccId = JSON.parse(localStorage.getItem("user"))._id;
                          setQrValue(
                            `https://admin-one-livid.vercel.app/RegistroResidente?id=${fraccId}&casa=${row.numero}`
                          );
                          setOpenQR(true);
                        }}
                      >
                        <RemoveRedEyeIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenForm(row)}
                      >
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ px: 1, py: 0 }}>
                      <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Residentes
                          </Typography>
                          <Table size="small">
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
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
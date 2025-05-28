import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
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
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import Navbar from "../commponents/Navbar";

const API_URL = process.env.REACT_APP_API_URL_PROD;

export default function DashboardFracc() {
  const [data, setData] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openAddCasa, setOpenAddCasa] = useState(false);
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", relacion: "" });
  const [newCasa, setNewCasa] = useState({ numero: "", propietario: "" });

  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.residencias) return;
      const response = await axios.get(`${API_URL}/api/fracc/${user._id}`);
      const casas = response.data.residencias || [];

      const dataFormatted = casas.map((casa, index) => ({
        id: index + 1,
        numero: casa.numero,
        propietario: casa.propietario,
        activa: casa.activa, // nuevo campo
        residentes: casa.residentes.map((res) => ({
          nombre: res.nombre,
          edad: res.edad,
          relacion: res.relacion,
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
      setNewCasa({ numero: "", propietario: ""});
      setOpenAddCasa(false);
      fetchData();
    } catch (error) {
      console.error("❌ Error al agregar casa:", error);
    }
  };

  // Nueva función para activar/desactivar casa
  const toggleCasaActiva = async (numero) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.put(`${API_URL}/api/fracc/${user._id}/casas/${numero}/toggle`);
      fetchData();
    } catch (error) {
      console.error("❌ Error al cambiar estado de la casa:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 3 }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: "1200px",
            width: "100%",
            mx: "auto",
            p: isMobile ? 1.5 : 3,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="600" color="black">
              Casas del Fraccionamiento
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => setOpenAddCasa(true)}
                variant="contained"
                size={isMobile ? "small" : "medium"}
                startIcon={<AddIcon />}
                sx={{ bgcolor: "#0ba969", ":hover": { bgcolor: "#0a8d5d" } }}
              >
                Agregar Casa
              </Button>
              <Button
                onClick={() => navigate(`/reportes/${userId}`)}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ ml: 2 }}
              >
                Ver Reportes
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Residencia</TableCell>
                  <TableCell>QR</TableCell>
                  <TableCell>Agregar</TableCell>
                  <TableCell>Activa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <>
                    <TableRow key={row.id}>
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
                              `https://registro.eskayser.app?id=${fraccId}&casa=${row.numero}`
                            );
                            setOpenQR(true);
                          }}
                        >
                          <RemoveRedEyeIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => handleOpenForm(row)} size="small" style={{backgroundColor:"#0ba969", color:"white"}}>
                          Agregar
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => toggleCasaActiva(row.numero)}
                          variant="outlined"
                          size="small"
                          sx={{ backgroundColor: row.activa ? "#4caf50" : "#f44336", color: "white" }}
                        >
                          {row.activa ? "Activa" : "Bloqueada"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} sx={{ px: 1, py: 0 }}>
                        <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                          <Box marginY={1}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Residentes
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nombre</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.residentes.map((res, idx) => (
                                  <TableRow key={idx} sx={{ backgroundColor: "#f9f9f9" }}>
                                    <TableCell>{res.nombre}</TableCell>
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

          <Dialog open={openQR} onClose={() => setOpenQR(false)}>
            <DialogTitle sx={{ fontSize: 16 }}>QR de Registro</DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
              <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    qrValue
                  )}`}
                  alt="QR"
                  style={{ display: "block", margin: "0 auto" }}
                />
                <Typography variant="caption" sx={{ mt: 2, wordBreak: "break-all" }}>
                  {qrValue}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenQR(false)} variant="contained" size="small">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openForm} onClose={() => setOpenForm(false)}>
            <DialogTitle sx={{ fontSize: 16 }}>Agregar Residente</DialogTitle>
            <DialogContent>
              <TextField size="small" label="Nombre" name="nombre" onChange={handleInputChange} fullWidth />
              <TextField size="small" label="Relación" name="relacion" onChange={handleInputChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenForm(false)} size="small">Cancelar</Button>
              <Button onClick={handleAddResidente} size="small">Agregar</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openAddCasa} onClose={() => setOpenAddCasa(false)}>
            <DialogTitle sx={{ fontSize: 16 }}>Agregar Casa</DialogTitle>
            <DialogContent>
              <TextField size="small" label="Número" name="numero" onChange={handleCasaChange} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddCasa(false)} size="small">Cancelar</Button>
              <Button onClick={handleAddCasa} size="small">Agregar</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </>
  );
}

import { useState, useEffect } from "react";
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
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Casas del Fraccionamiento</Typography>
        <Button onClick={() => setOpenAddCasa(true)} variant="contained">
          Agregar Casa
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
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
              <>
                <TableRow key={row.id}>
                  <TableCell>
                    <IconButton onClick={() => toggleRow(row.id)}>
                      {openRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        const fraccId = JSON.parse(localStorage.getItem("user"))._id;
                        setQrValue(
                          `https://admin-one-livid.vercel.app/RegistroResidente?id=${fraccId}&casa=${row.numero}`
                        );
                        setOpenQR(true);
                      }}
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleOpenForm(row)}>
                      Agregar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="subtitle1">Residentes</Typography>
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
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal QR */}
      <Dialog open={openQR} onClose={() => setOpenQR(false)}>
        <DialogTitle>QR de Registro</DialogTitle>
        <DialogContent>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              qrValue
            )}`}
            alt="QR"
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {qrValue}
          </Typography>
          <Button onClick={() => setOpenQR(false)} variant="contained" sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal Agregar Residente */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Agregar Residente</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" name="nombre" onChange={handleInputChange} fullWidth />
          <TextField label="Edad" name="edad" type="number" onChange={handleInputChange} fullWidth />
          <TextField label="Relación" name="relacion" onChange={handleInputChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddResidente} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar Casa */}
      <Dialog open={openAddCasa} onClose={() => setOpenAddCasa(false)}>
        <DialogTitle>Agregar Casa</DialogTitle>
        <DialogContent>
          <TextField label="Número" name="numero" onChange={handleCasaChange} fullWidth />
          <TextField label="Propietario" name="propietario" onChange={handleCasaChange} fullWidth />
          <TextField label="Teléfono" name="telefono" onChange={handleCasaChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCasa(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddCasa} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
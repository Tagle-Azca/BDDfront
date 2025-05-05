import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const API_URL = process.env.REACT_APP_API_URL_PROD;

const CollapsibleTable = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    telefono: "",
  });

  useEffect(() => {
    const fraccId = localStorage.getItem("fraccId");
    if (!fraccId) {
      console.warn("ID de fraccionamiento no encontrado en localStorage.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/residencias/get-house`);
        const data = response.data
          .filter((item) => item.fraccionamientoId === fraccId)
          .map((item, index) => ({
            id: index + 1,
            _id: item._id,
            direccion: item.direccion,
            fraccionamiento: item.fraccionamiento,
            residentes: item.residentes.map((residente) => ({
              nombre: residente.nombre,
              edad: residente.edad,
              telefono: residente.telefono,
              _id: residente._id,
            })),
          }));
        setRows(data);
        setFilteredRows(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filteredData = rows.filter(
      (row) =>
        row.direccion.toLowerCase().includes(value) ||
        row.fraccionamiento.toLowerCase().includes(value) ||
        row.residentes.some((residente) =>
          residente.nombre.toLowerCase().includes(value)
        )
    );

    setFilteredRows(filteredData);
  };

  const handleOpenForm = (row) => {
    setSelectedRow(row);
    setFormData({ nombre: "", edad: "", telefono: "" });
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddResidente = async () => {
    try {
      if (!selectedRow) return;
      const response = await axios.put(
        `${API_URL}/api/residencias/update-residentes/${selectedRow._id}`,
        { residentes: [...selectedRow.residentes, formData] }
      );

      const updatedRow = response.data.data;
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === updatedRow._id
            ? { ...row, residentes: updatedRow.residentes }
            : row
        )
      );

      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row._id === updatedRow._id
            ? { ...row, residentes: updatedRow.residentes }
            : row
        )
      );

      handleCloseForm();
    } catch (error) {
      console.error("Error al agregar el residente:", error);
    }
  };

  const Row = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.direccion}</TableCell>
          <TableCell>{row.fraccionamiento}</TableCell>
          <TableCell>{row.residentes.length}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              onClick={() => handleOpenForm(row)}
              style={{ backgroundColor: "#00b34e" }}
            >
              Agregar Residente
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Residentes
                </Typography>
                <Table size="small" aria-label="residents">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Edad</TableCell>
                      <TableCell>Teléfono</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.residentes.map((residente) => (
                      <TableRow key={residente._id}>
                        <TableCell>{residente.nombre}</TableCell>
                        <TableCell>{residente.edad}</TableCell>
                        <TableCell>{residente.telefono}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#00b34e" }}
            onClick={() => setOpenForm(true)}
          >
            Agregar Nuevo
          </Button>
          <TextField
            label="Buscar..."
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Dirección</TableCell>
                <TableCell>Fraccionamiento</TableCell>
                <TableCell># Residentes</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay residentes registrados en este fraccionamiento.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => <Row key={row._id} row={row} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>Agregar Residente</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" name="nombre" onChange={handleInputChange} fullWidth />
          <TextField label="Edad" name="edad" type="number" onChange={handleInputChange} fullWidth />
          <TextField label="Teléfono" name="telefono" onChange={handleInputChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">Cancelar</Button>
          <Button onClick={handleAddResidente} color="primary">Agregar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CollapsibleTable;

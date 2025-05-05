import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AgregarFraccionamientoModal from "./AgregarFracionamientoModal"; 
import EditarFraccionamientoModal from "./ModificarFraccionamientoModal"; 
import ContactoModal from "./ContactoModal";
import { QRCodeSVG } from "qrcode.react";

const API_URL = process.env.REACT_APP_API_URL_PROD;
export default function TableAdmin() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openContactoModal, setOpenContactoModal] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data.map((item, index) => ({
        id: index + 1,
        _id: item._id,
        fraccionamiento: item.nombre || "Sin nombre",
        usuario: item.usuario || "No asignado",
        direccion: item.direccion || "Sin dirección",
        correo: item.correo || "Sin correo",
        telefono: item.telefono || "Sin teléfono",
        estado: item.estado || "activo",
        fechaExpiracion: item.fechaExpiracion ? new Date(item.fechaExpiracion).toLocaleDateString() : "No disponible",
        qr: item.qrVisitas || "No disponible",
      }));

      setRows(data);
      setFilteredRows(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al obtener los fraccionamientos:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAgregar = () => {
    setOpenAgregar(true);
  };

  const handleCloseAgregar = () => {
    setOpenAgregar(false);
  };

  const handleOpenEditar = (row) => {
    setSelectedRow(row);
    setOpenEditar(true);
  };

  const handleCloseEditar = () => {
    setOpenEditar(false);
    setSelectedRow(null);
  };

  const handleOpenContactoModal = (row) => {
    setSelectedContacto(row);
    setOpenContactoModal(true);
  };

  const handleCloseContactoModal = () => {
    setOpenContactoModal(false);
    setSelectedContacto(null);
  };

  const handleQrModal = (row) => {
    setQrData(row.qr);
    setOpenQrModal(true);
  };

  const handleCloseQrModal = () => setOpenQrModal(false);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          label="Buscar..."
          variant="outlined"
          sx={{ width: "300px" }}
          onChange={(e) =>
            setFilteredRows(
              rows.filter((row) =>
                Object.values(row).some(
                  (val) =>
                    typeof val === "string" &&
                    val.toLowerCase().includes(e.target.value.toLowerCase())
                )
              )
            )
          }
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#00b34e" }}
          onClick={handleOpenAgregar}
        >
          Agregar Nuevo
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Fraccionamiento</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Expiración</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover key={row._id}>
                <TableCell>{row.fraccionamiento}</TableCell>
                <TableCell>{row.usuario}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "8px",
                      color: "white",
                      backgroundColor: row.estado === "activo" ? "#00b34e" : "#f44336",
                    }}
                  >
                    {row.estado}
                  </span>
                </TableCell>
                <TableCell>{row.fechaExpiracion}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenContactoModal(row)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleQrModal(row)}>
                    <QrCodeIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenEditar(row)}>
                    <EditIcon /> {/* Icono de edición */}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AgregarFraccionamientoModal open={openAgregar} handleClose={handleCloseAgregar} fetchData={fetchData} />

      <EditarFraccionamientoModal
        open={openEditar}
        handleClose={handleCloseEditar}
        fraccionamiento={selectedRow}
        fetchData={fetchData}
      />

      <ContactoModal {...{ open: openContactoModal, handleClose: handleCloseContactoModal, contacto: selectedContacto }} />

      <Dialog open={openQrModal} onClose={handleCloseQrModal}>
        <DialogTitle>QR del Fraccionamiento</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>{qrData && <QRCodeSVG value={qrData} size={200} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQrModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { QRCodeSVG } from "qrcode.react";

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    usuario: "",
    fraccionamiento: "",
    correo: "",
    contrasena: "",
  });

  const API_URL = "http://localhost:5002/api/fracc";

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "usuario", headerName: "Usuario", width: 200 },
    { field: "fraccionamiento", headerName: "Fraccionamiento", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => (
        <Switch
          style={{
            color: params.row.estado === "activo" ? "#00b34e" : "#f44336",
          }}
          checked={params.row.estado === "activo"}
          onChange={() => handleEstadoChange(params.row._id, params.row.estado)}
        />
      ),
    },
    {
      field: "Cambios y QR",
      headerName: "Cambios y QR",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleQrModal(params.row)}>
            <QrCodeIcon />
          </IconButton>
        </>
      ),
    },
    { field: "correo", headerName: "Correo", width: 250 },
    { field: "fechaExpedicion", headerName: "Fecha de Expedición", width: 200 },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/fraccionamientos`);
      const data = response.data.map((item, index) => ({
        id: index + 1,
        _id: item._id,
        usuario: item.usuario,
        fraccionamiento: item.fraccionamiento,
        estado: item.Estado,
        qr: item.qr,
        correo: item.correo,
        fechaExpedicion: new Date(item.fechaExpedicion).toLocaleDateString(),
      }));
      setRows(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEstadoChange = async (id, currentEstado) => {
    const newEstado = currentEstado === "activo" ? "inactivo" : "activo";
    try {
      await axios.patch(`${API_URL}/fraccionamientos/${id}`, {
        Estado: newEstado,
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === id ? { ...row, estado: newEstado } : row
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  };

  const handleOpenForm = () => {
    setFormData({
      usuario: "",
      fraccionamiento: "",
      correo: "",
      contrasena: "",
    });
    setEditMode(false);
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);

  const handleQrModal = (row) => {
    setQrData(row);
    setOpenQrModal(true);
  };

  const handleCloseQrModal = () => setOpenQrModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFraccionamiento = async () => {
    try {
      const response = await axios.post(`${API_URL}/add`, formData);
      const newData = response.data.data;
      const newRow = {
        id: rows.length + 1,
        _id: newData._id,
        usuario: newData.usuario,
        fraccionamiento: newData.fraccionamiento,
        estado: newData.Estado,
        qr: newData.qr,
        correo: newData.correo,
        fechaExpedicion: new Date(newData.fechaExpedicion).toLocaleDateString(),
      };
      setRows((prevRows) => [...prevRows, newRow]);
      handleCloseForm();
    } catch (error) {
      console.error("Error al agregar el fraccionamiento:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      usuario: row.usuario,
      fraccionamiento: row.fraccionamiento,
      correo: row.correo,
      contrasena: "",
    });
    setSelectedRow(row);
    setEditMode(true);
    setOpenForm(true);
  };

  const handleUpdateFraccionamiento = async () => {
    try {
      const updatedData = {};
      if (formData.usuario) updatedData.usuario = formData.usuario;
      if (formData.fraccionamiento)
        updatedData.fraccionamiento = formData.fraccionamiento;
      if (formData.correo) updatedData.correo = formData.correo;
      if (formData.contrasena) updatedData.contrasena = formData.contrasena;

      await axios.put(`${API_URL}/update/${selectedRow._id}`, updatedData);
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === selectedRow._id
            ? { ...row, ...updatedData, contrasena: undefined }
            : row
        )
      );
      handleCloseForm();
    } catch (error) {
      console.error("Error al actualizar el fraccionamiento:", error);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Button
        variant="contained"
        style={{ backgroundColor: "#00b34e" }}
        onClick={handleOpenForm}
      >
        Agregar Nuevo
      </Button>
      <div style={{ height: "calc(100% - 60px)", marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        />
      </div>
      {/* Modal de Formulario */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>
          {editMode ? "Editar Fraccionamiento" : "Agregar Fraccionamiento"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Usuario"
            name="usuario"
            fullWidth
            value={formData.usuario}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Correo"
            name="correo"
            fullWidth
            value={formData.correo}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Contraseña"
            name="contrasena"
            type="password"
            fullWidth
            value={formData.contrasena}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Fraccionamiento"
            name="fraccionamiento"
            fullWidth
            value={formData.fraccionamiento}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={
              editMode ? handleUpdateFraccionamiento : handleAddFraccionamiento
            }
            color="primary"
          >
            {editMode ? "Actualizar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar el QR */}
      <Dialog open={openQrModal} onClose={handleCloseQrModal}>
        <DialogTitle>QR del Fraccionamiento</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {qrData && (
            <>
              <h3>{qrData.fraccionamiento}</h3>
              <QRCodeSVG value={qrData.qr} size={200} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQrModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTable;

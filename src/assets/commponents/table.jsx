import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Chip,
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { QRCodeCanvas } from "qrcode.react";

const initialRows = [
  {
    id: 1,
    fraccionamiento: "Los Robles",
    fechaCaducidad: "2023-01-01",
    estado: "Activo",
    fechaAgregacion: "2023-01-01",
  },
  {
    id: 2,
    fraccionamiento: "La Primavera",
    fechaCaducidad: "2024-12-15",
    estado: "Inactivo",
    fechaAgregacion: "2023-03-12",
  },
  {
    id: 3,
    fraccionamiento: "El Lago",
    fechaCaducidad: "2025-01-20",
    estado: "Activo",
    fechaAgregacion: "2023-05-10",
  },
  {
    id: 4,
    fraccionamiento: "Monte Verde",
    fechaCaducidad: "2024-09-10",
    estado: "Inactivo",
    fechaAgregacion: "2023-07-20",
  },
  {
    id: 5,
    fraccionamiento: "El Olivo",
    fechaCaducidad: "2025-11-11",
    estado: "Activo",
    fechaAgregacion: "2024-01-01",
  },
];

const DataTable = () => {
  // Estado para las filas de la tabla
  const [rows, setRows] = useState(initialRows);

  // -------- QR --------
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrData, setQrData] = useState("");

  const handleGenerateQR = (data) => {
    setQrData(data);
    setOpenQRModal(true);
  };

  // -------- Editar Nombre --------
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [updatedFraccionamiento, setUpdatedFraccionamiento] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEditClick = (row) => {
    setEditingRow(row);
    setUpdatedFraccionamiento(row.fraccionamiento);
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    if (showPasswordChange) {
      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      if (!newPassword || !confirmPassword) {
        alert("Por favor, llena los campos de la nueva contraseña.");
        return;
      }

      // Lógica para guardar la nueva contraseña en la base de datos
      console.log("Nueva contraseña guardada:", newPassword);
    }

    // Guardar cambios en el fraccionamiento
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === editingRow.id
          ? { ...row, fraccionamiento: updatedFraccionamiento }
          : row
      )
    );

    setOpenEditModal(false);
    setEditingRow(null);
    setShowPasswordChange(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [nuevo, setNuevo] = useState({
    fraccionamiento: "",
    meses: "", //
  });

  const handleOpenAddModal = () => {
    setNuevo({
      fraccionamiento: "",
      meses: "",
    });
    setOpenAddModal(true);
  };

  const handleAdd = () => {
    // Validamos que haya fraccionamiento y algún valor de meses
    if (!nuevo.fraccionamiento || !nuevo.meses) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    // Obtenemos la fecha de hoy
    const fechaHoy = new Date();

    // Sumamos los meses seleccionados
    // (para "2 años", usamos 24 meses)
    fechaHoy.setMonth(fechaHoy.getMonth() + parseInt(nuevo.meses));

    // Formateamos la fecha de caducidad a "YYYY-MM-DD"
    const fechaCad = fechaHoy.toISOString().split("T")[0];

    // Fecha de agregación como la fecha del día actual
    const fechaAgreg = new Date().toISOString().split("T")[0];

    // Agregamos a la tabla
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1, // Generar ID
        fraccionamiento: nuevo.fraccionamiento,
        fechaCaducidad: fechaCad,
        estado: "Activo", // valor por defecto
        fechaAgregacion: fechaAgreg,
      },
    ]);

    setOpenAddModal(false);
  };

  // -------- Render de etiqueta de estado --------
  const renderEstadoChip = (estado) => {
    switch (estado) {
      case "Activo":
        return <Chip label="Activo" color="success" />;
      case "Inactivo":
        return <Chip label="Inactivo" color="error" />;
      default:
        return <Chip label="Desconocido" color="warning" />;
    }
  };

  // -------- Columnas de la tabla --------
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fraccionamiento", headerName: "Fraccionamiento", width: 200 },
    {
      field: "fechaAgregacion",
      headerName: "Fecha de Agregación",
      width: 150,
    },
    {
      field: "fechaCaducidad",
      headerName: "Fecha de Caducidad",
      width: 150,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 150,
      renderCell: (params) => renderEstadoChip(params.value),
    },
    {
      field: "generarQR",
      headerName: "Generar QR",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            borderRadius: "20px",
            backgroundColor: "#ddd",
            color: "#000",
          }}
          onClick={() => handleGenerateQR(params.row.fraccionamiento)}
        >
          Generar QR
        </Button>
      ),
    },
    {
      field: "editar",
      headerName: "",
      width: 80,
      align: "right",
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        p: 3,
        border: "none",
        boxShadow: "none",
      }}
    >
      {/* Encabezado */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Administración de Fraccionamientos</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOpenAddModal}
        >
          Agregar
        </Button>
      </Box>

      {/* Tabla */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        components={{ Toolbar: GridToolbar }}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
          },
        }}
      />

      {/* Modal Generar QR */}
      <Dialog open={openQRModal} onClose={() => setOpenQRModal(false)}>
        <DialogContent sx={{ textAlign: "center" }}>
          <QRCodeCanvas value={qrData} size={200} />
          <Typography variant="body1" sx={{ mt: 2, fontSize: 20 }}>
            {qrData}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRModal(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Cambio de Nombre</DialogTitle>
        <DialogContent>
          {/* Campo para editar el fraccionamiento */}
          <TextField
            fullWidth
            label="Editar Fraccionamiento"
            value={updatedFraccionamiento}
            onChange={(e) => setUpdatedFraccionamiento(e.target.value)}
            margin="dense"
          />
          {/* Texto para mostrar el formulario de cambiar contraseña */}
          <Typography
            variant="body2"
            sx={{ mt: 2, color: "blue", cursor: "pointer" }}
            onClick={() => setShowPasswordChange((prev) => !prev)}
          >
            {showPasswordChange
              ? "Ocultar cambiar contraseña"
              : "Cambiar contraseña"}
          </Typography>
          {showPasswordChange && (
            <>
              {/* Campo para nueva contraseña */}
              <TextField
                fullWidth
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="dense"
              />
              {/* Campo para confirmar nueva contraseña */}
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="dense"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEditModal(false)}
            color="primary"
            size="small"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            color="success"
            variant="contained"
            size="small"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar Nuevo */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Nuevo Fraccionamiento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre del Fraccionamiento"
            value={nuevo.fraccionamiento}
            onChange={(e) =>
              setNuevo((prev) => ({ ...prev, fraccionamiento: e.target.value }))
            }
          />
          {/* Selector de meses */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Vigencia</InputLabel>
            <Select
              label="Vigencia"
              value={nuevo.meses}
              onChange={(e) =>
                setNuevo((prev) => ({ ...prev, meses: e.target.value }))
              }
            >
              <MenuItem value={1}>1 mes</MenuItem>
              <MenuItem value={2}>2 meses</MenuItem>
              <MenuItem value={6}>6 meses</MenuItem>
              <MenuItem value={12}>12 meses</MenuItem>
              <MenuItem value={24}>2 años</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddModal(false)}
            color="primary"
            size="small"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            color="success"
            variant="contained"
            size="small"
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;

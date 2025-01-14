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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { QRCodeCanvas } from "qrcode.react";

const initialRows = [
  {
    id: 1,
    fraccionamiento: "Los Robles",
    fechaCaducidad: "01/01/2023",
    estado: "Activo",
  },
  {
    id: 2,
    fraccionamiento: "La Primavera",
    fechaCaducidad: "15/12/2024",
    estado: "Inactivo",
  },
  {
    id: 3,
    fraccionamiento: "El Lago",
    fechaCaducidad: "20/01/2025",
    estado: "Activo",
  },
  {
    id: 4,
    fraccionamiento: "Monte Verde",
    fechaCaducidad: "10/09/2024",
    estado: "Inactivo",
  },
  {
    id: 5,
    fraccionamiento: "El Olivo",
    fechaCaducidad: "11/11/2025",
    estado: "Activo",
  },
];

const DataTable = () => {
  const [rows, setRows] = useState(initialRows);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [qrData, setQrData] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [updatedFraccionamiento, setUpdatedFraccionamiento] = useState("");

  const handleGenerateQR = (data) => {
    setQrData(data);
    setOpenQRModal(true);
  };

  const handleEditClick = (row) => {
    setEditingRow(row);
    setUpdatedFraccionamiento(row.fraccionamiento);
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === editingRow.id
          ? { ...row, fraccionamiento: updatedFraccionamiento }
          : row
      )
    );
    setOpenEditModal(false);
    setEditingRow(null);
  };

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

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fraccionamiento", headerName: "Fraccionamiento", width: 200 },
    { field: "fechaCaducidad", headerName: "Fecha de Caducidad", width: 150 },
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
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Administración de Fraccionamientos</Typography>
      </Box>
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

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Cambio de Nombre</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Editar"
            value={updatedFraccionamiento}
            onChange={(e) => setUpdatedFraccionamiento(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="success" variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;

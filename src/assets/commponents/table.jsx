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
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const initialRows = [
  {
    id: 1,
    fraccionamiento: "Los Robles",
    fechaCaducidad: "2025-06-01",
    estado: "Activo",
  },
  {
    id: 2,
    fraccionamiento: "La Primavera",
    fechaCaducidad: "2024-12-15",
    estado: "Inactivo",
  },
  {
    id: 3,
    fraccionamiento: "El Lago",
    fechaCaducidad: "2026-01-20",
    estado: "Activo",
  },
  {
    id: 4,
    fraccionamiento: "Monte Verde",
    fechaCaducidad: "2024-09-10",
    estado: "Inactivo",
  },
  {
    id: 5,
    fraccionamiento: "El Olivo",
    fechaCaducidad: "2025-11-11",
    estado: "Activo",
  },
];

const DataTable = () => {
  const [rows, setRows] = useState(initialRows);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrData, setQrData] = useState("");

  const handleDeleteSelected = () => {
    setOpenConfirm(true);
  };

  const confirmDelete = () => {
    setRows((prevRows) =>
      prevRows.filter((row) => !selectedRows.includes(row.id))
    );
    setSelectedRows([]);
    setOpenConfirm(false);
  };

  const handleGenerateQR = (data) => {
    setQrData(data);
    setOpenQRModal(true);
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
    { field: "id", headerName: "ID", width: 70, sortable: true },
    {
      field: "fraccionamiento",
      headerName: "Fraccionamiento",
      width: 200,
      sortable: true,
    },
    {
      field: "fechaCaducidad",
      headerName: "Fecha de Caducidad",
      width: 150,
      sortable: true,
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
            backgroundColor: "#FFFF",
            color: "#000",
          }}
          onClick={() => handleGenerateQR(params.row.fraccionamiento)}
        >
          Generar QR
        </Button>
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
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
        >
          Eliminar Seleccionados
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection)
        }
        components={{ Toolbar: GridToolbar }}
        getRowClassName={(params) =>
          params.row.estado === "Activo" ? "activo-row" : "inactivo-row"
        }
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
          "& .activo-row": {
            backgroundColor: "#d4edda",
          },
          "& .inactivo-row": {
            backgroundColor: "#f8d7da",
          },
        }}
      />

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>Seguro deseas eliminar los seeccionados?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openQRModal} onClose={() => setOpenQRModal(false)}>
        <DialogContent sx={{ textAlign: "center" }}>
          <QRCodeCanvas value={qrData} size={200} />
          <Typography variant="body1" sx={{ mt: 2, fontSize: 46 }}>
            {qrData}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRModal(false)} color="black">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataTable;

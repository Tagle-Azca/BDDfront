import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { generateQRCode } from "../utils/generateQR";

const rowsData = [
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

export default function DataTable() {
  const [rows, setRows] = React.useState(rowsData);
  const [qrImage, setQrImage] = React.useState("");
  const [selectedFraccionamiento, setSelectedFraccionamiento] =
    React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleGenerateQR = async (text) => {
    const qrCodeImage = await generateQRCode(text);
    setQrImage(qrCodeImage);
    setSelectedFraccionamiento(text);
    setIsModalOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fraccionamiento",
      headerName: "Fraccionamiento",
      width: 200,
      editable: true,
    },
    {
      field: "fechaCaducidad",
      headerName: "Fecha de Caducidad",
      width: 150,
      editable: true,
    },
    { field: "estado", headerName: "Estado", width: 120, editable: true },
    {
      field: "generarQR",
      headerName: "Generar QR",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#42f560",
            color: "black",
            "&:hover": { backgroundColor: "#36c94e" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleGenerateQR(params.row.fraccionamiento);
          }}
        >
          Generar QR
        </Button>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Código QR Generado</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <h3>Código QR para: {selectedFraccionamiento}</h3>
          {qrImage && (
            <img
              src={qrImage}
              alt={`QR para ${selectedFraccionamiento}`}
              style={{
                maxWidth: "200px",
                height: "auto",
                border: "1px solid black",
                padding: "10px",
                marginLeft: "2rem",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

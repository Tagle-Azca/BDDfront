import React from "react";
import { TableRow, TableCell, Box, Typography, Button } from "@mui/material";
import { Home, Add } from "@mui/icons-material";

const EmptyState = ({ onAddNew }) => (
  <TableRow>
    <TableCell colSpan={5} align="center" sx={{ py: 8, border: "none" }}>
      <Box sx={{ textAlign: "center" }}>
        <Home sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1, color: "#666" }}>
          No hay residencias registradas
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#999" }}>
          Comienza agregando la primera residencia de este fraccionamiento
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddNew}
          sx={{
            backgroundColor: "#00b34e",
            "&:hover": { backgroundColor: "#009640" },
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Agregar Primera Residencia
        </Button>
      </Box>
    </TableCell>
  </TableRow>
);

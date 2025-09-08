import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Person, Phone, Delete } from "@mui/icons-material";

const ResidentsDetails = ({ residents, onDeleteResident }) => (
  <Box sx={{ margin: 2 }}>
    <Paper 
      elevation={0}
      sx={{ 
        backgroundColor: "#f8f9fa", 
        borderRadius: "12px",
        p: 2,
        border: "1px solid #e0e0e0"
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: "#1a1a1a", 
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <Person />
        Residentes ({residents.length})
      </Typography>

      {residents.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 3, color: "#666" }}>
          <Typography>No hay residentes registrados</Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, border: "none" }}>
                Residente
              </TableCell>
              <TableCell sx={{ fontWeight: 600, border: "none" }}>
                Contacto
              </TableCell>
              <TableCell sx={{ fontWeight: 600, border: "none" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600, border: "none", width: 100 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {residents.map((residente) => (
              <TableRow key={residente._id} hover>
                <TableCell sx={{ border: "none" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: "#00b34e" 
                      }}
                    >
                      {residente.nombre.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontWeight: 500 }}>
                      {residente.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: "#666" }} />
                    <Typography variant="body2">
                      {residente.telefono}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Chip
                    label="Activo"
                    color="success"
                    size="small"
                    sx={{ borderRadius: "6px" }}
                  />
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  <Tooltip title="Eliminar residente">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteResident(residente._id)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          backgroundColor: "error.light",
                          color: "white",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  </Box>
);

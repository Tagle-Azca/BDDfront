import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import ResidenceRow from "./ResidenceRow";
import EmptyState from "./EmptyState";

const ResidenceTableView = ({ rows, onAddResident }) => (
  <Paper 
    elevation={0}
    sx={{ 
      borderRadius: "16px", 
      border: "1px solid #e0e0e0",
      overflow: "hidden"
    }}
  >
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
            <TableCell sx={{ width: 50 }} />
            <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Dirección
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Fraccionamiento
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1a1a1a", textAlign: "center" }}>
              Residentes
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: "#1a1a1a", textAlign: "center" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <EmptyState />
          ) : (
            rows.map((row) => (
              <ResidenceRow 
                key={row._id} 
                row={row} 
                onAddResident={onAddResident}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

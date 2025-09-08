import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Button,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  PersonAdd,
  LocationOn,
  People,
} from "@mui/icons-material";
import ResidentsDetails from "./ResidentsDetails";

const ResidenceRow = ({ row, onAddResident, onDeleteResident }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        hover
        sx={{ 
          "&:hover": { backgroundColor: "#fafafa" },
          borderBottom: open ? "none" : "1px solid #e0e0e0"
        }}
      >
        <TableCell>
          <Tooltip title={open ? "Ocultar residentes" : "Ver residentes"}>
            <IconButton 
              size="small" 
              onClick={() => setOpen(!open)}
              sx={{ 
                backgroundColor: open ? "#e3f2fd" : "transparent",
                "&:hover": { backgroundColor: "#e3f2fd" }
              }}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOn sx={{ color: "#666", fontSize: 20 }} />
            <Box>
              <div style={{ fontWeight: 500, color: "#1a1a1a" }}>
                {row.direccion}
              </div>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Chip
            label={row.fraccionamiento}
            variant="outlined"
            size="small"
            sx={{ borderRadius: "8px" }}
          />
        </TableCell>

        <TableCell align="center">
          <Chip
            icon={<People />}
            label={row.residentes.length}
            color={row.residentes.length > 0 ? "success" : "default"}
            size="small"
            sx={{ 
              minWidth: 80,
              fontWeight: 600
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={() => onAddResident(row)}
            sx={{
              borderColor: "#00b34e",
              color: "#00b34e",
              "&:hover": {
                backgroundColor: "#00b34e",
                color: "white",
              },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Agregar
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell 
          style={{ paddingBottom: 0, paddingTop: 0, border: "none" }} 
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ResidentsDetails 
              residents={row.residentes} 
              onDeleteResident={(residentId) => onDeleteResident(row._id, residentId)}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
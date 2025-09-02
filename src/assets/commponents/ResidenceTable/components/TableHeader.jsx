import React from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search, Add, Home } from "@mui/icons-material";

const TableHeader = ({ onAddNew, search, onSearchChange, totalResidences, totalResidents }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1 }}>
          Gestión de Residencias
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Chip 
            icon={<Home />}
            label={`${totalResidences} residencias`}
            variant="outlined"
            size="small"
          />
          <Chip 
            label={`${totalResidents} residentes`}
            color="primary"
            size="small"
          />
        </Box>
      </Box>
      
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
          px: 3,
        }}
      >
        Nueva Residencia
      </Button>
    </Box>

    <TextField
      placeholder="Buscar por dirección, fraccionamiento o residente..."
      variant="outlined"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: "#666" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
        },
      }}
    />
  </Box>
);

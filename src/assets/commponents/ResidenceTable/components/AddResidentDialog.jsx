import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import { PersonAdd, Close } from "@mui/icons-material";

const AddResidentDialog = ({ open, onClose, onSubmit, selectedRow }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setFormData({ nombre: "", telefono: "" });
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = "Ingresa un teléfono válido (10 dígitos)";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAdd sx={{ color: "#00b34e" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Agregar Nuevo Residente
          </Typography>
        </Box>
        {selectedRow && (
          <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
            {selectedRow.direccion} - {selectedRow.fraccionamiento}
          </Typography>
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          
          <TextField
            label="Número de teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            error={!!errors.telefono}
            helperText={errors.telefono}
            fullWidth
            variant="outlined"
            placeholder="Ej: 3331234567"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />

          {selectedRow && selectedRow.residentes.length > 0 && (
            <Alert severity="info" sx={{ borderRadius: "10px" }}>
              Esta residencia ya tiene {selectedRow.residentes.length} residente(s) registrado(s)
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          startIcon={<Close />}
          sx={{ 
            borderRadius: "8px",
            textTransform: "none",
            borderColor: "#ccc",
            color: "#666"
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{
            backgroundColor: "#00b34e",
            "&:hover": { backgroundColor: "#009640" },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Agregar Residente
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResidentDialog;
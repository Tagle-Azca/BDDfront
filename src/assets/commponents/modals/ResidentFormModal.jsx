import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  Chip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ResidentFormModal = ({
  open,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  selectedCasa,
  loading = false,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = () => {
    if (!formData.nombre.trim()) return;
    onSubmit();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullScreen={isMobile}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          minHeight: isMobile ? '100vh' : 'auto',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: 20, 
        fontWeight: 600,
        pb: 1,
        background: 'linear-gradient(135deg, #0ba969 0%, #0a8d5d 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <PersonAddIcon />
        Agregar Nuevo Residente
        {selectedCasa && (
          <Chip 
            label={`Casa ${selectedCasa.numero}`}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              ml: 'auto'
            }}
          />
        )}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Nombre completo" 
            name="nombre" 
            value={formData.nombre}
            onChange={onInputChange} 
            fullWidth 
            variant="outlined"
            placeholder="Ingrese el nombre completo"
            InputProps={{
              sx: { borderRadius: 2 }
            }}
            required
          />
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Información:</strong> El residente será agregado a la casa {selectedCasa?.numero} y podrá registrar visitas usando el código QR correspondiente.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          size="medium"
          disabled={loading}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          size="medium"
          disabled={!formData.nombre.trim() || loading}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            }
          }}
        >
          {loading ? 'Agregando...' : 'Agregar Residente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResidentFormModal;
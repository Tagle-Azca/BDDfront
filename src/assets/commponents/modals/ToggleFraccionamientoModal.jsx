import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

const ToggleFraccionamientoModal = ({
  open,
  onClose,
  onConfirm,
  fraccionamiento,
  loading = false,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  
  if (!fraccionamiento) return null;

  const isActive = fraccionamiento.estado === "activo";
  const action = isActive ? "desactivar" : "activar";
  const newStatus = isActive ? "inactivo" : "activo";

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
        background: isActive 
          ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
          : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
        {isActive ? 'Desactivar' : 'Activar'} Fraccionamiento
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
          ¿Estás seguro de que deseas <strong>{action}</strong> el fraccionamiento <strong>"{fraccionamiento.fraccionamiento}"</strong>?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        justifyContent: 'center'
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
          sx={{ 
            borderRadius: 2,
            px: 3,
            textTransform: 'none'
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          disabled={loading}
          color={isActive ? "error" : "success"}
          sx={{ 
            borderRadius: 2,
            px: 3,
            textTransform: 'none'
          }}
        >
          {loading ? 'Procesando...' : `${isActive ? 'Desactivar' : 'Activar'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToggleFraccionamientoModal;
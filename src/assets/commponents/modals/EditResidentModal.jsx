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
import EditIcon from "@mui/icons-material/Edit";

const EditResidentModal = ({
  open,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  selectedCasa,
  editingResident,
  loading = false,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = () => {
    if (!formData.nombre.trim() || !formData.relacion.trim()) return;
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
        <EditIcon />
        Editar Residente
        {selectedCasa && editingResident && (
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
      
      <DialogContent sx={{ pt: 6, pb: 3, px: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
          <TextField 
            label="Nombre completo" 
            name="nombre" 
            value={formData.nombre}
            onChange={onInputChange} 
            fullWidth 
            variant="outlined"
            placeholder="Ingrese el nombre completo"
            InputProps={{
              sx: { 
                borderRadius: 2,
                backgroundColor: '#fafafa'
              }
            }}
            InputLabelProps={{
              sx: { color: '#666' }
            }}
            required
          />
          <TextField 
            label="Relación con la propiedad" 
            name="relacion" 
            value={formData.relacion}
            onChange={onInputChange} 
            fullWidth 
            variant="outlined"
            placeholder="Ej: Propietario, Familiar, Inquilino, Empleado..."
            InputProps={{
              sx: { 
                borderRadius: 2,
                backgroundColor: '#fafafa'
              }
            }}
            InputLabelProps={{
              sx: { color: '#666' }
            }}
            helperText="Especifique la relación del residente con la propiedad"
            FormHelperTextProps={{
              sx: { 
                fontSize: '0.75rem',
                color: '#888',
                mt: 0.5
              }
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          size="large"
          disabled={loading}
          sx={{ 
            borderRadius: 3,
            px: 4,
            py: 1.2,
            borderColor: '#ccc',
            color: '#666',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#999',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          size="large"
          disabled={!formData.nombre.trim() || !formData.relacion.trim() || loading}
          sx={{ 
            borderRadius: 3,
            px: 4,
            py: 1.2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            boxShadow: '0 3px 10px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
            },
            '&:disabled': {
              background: '#ccc',
              color: '#999'
            }
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditResidentModal;
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddHouseModal = ({
  open,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  loading = false,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSubmit = () => {
    if (!formData.numero.trim()) return;
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
        <AddIcon />
        Agregar Nueva Casa
      </DialogTitle>
       
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Complete la información de la nueva casa
            </Typography>
          </Box>
          <TextField 
            label="Número de Casa" 
            name="numero" 
            value={formData.numero}
            onChange={onInputChange} 
            fullWidth 
            variant="outlined"
            placeholder="Ej: 101, A-5, etc."
            InputProps={{
              sx: { borderRadius: 2 }
            }}
            required
          />
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
          disabled={!formData.numero.trim() || loading}
          sx={{ 
            color: 'white', 
            borderRadius: 2,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            }
          }}
        >
          {loading ? 'Agregando...' : 'Agregar Casa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHouseModal;
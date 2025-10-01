import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  RestoreIcon,
  PersonOffIcon,
  HomeIcon
} from "@mui/icons-material";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD;

export default function ResidentesInactivos({ open, onClose, fraccionamientoId, onResidenteRestored }) {
  const [residentes, setResidentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open && fraccionamientoId) {
      fetchResidentesInactivos();
    }
  }, [open, fraccionamientoId]);

  const fetchResidentesInactivos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/fraccionamientos/${fraccionamientoId}/residentes/inactivos`);
      setResidentes(response.data.residentesInactivos || []);
    } catch (error) {
      console.error("Error fetching residentes inactivos:", error);
      setError("Error al cargar residentes inactivos");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreResidente = async (residente) => {
    setRestoring(residente._id);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.put(
        `${API_URL}/fraccionamientos/${fraccionamientoId}/casas/${residente.casa}/residentes/${residente._id}/restablecer`
      );
      
      setSuccess(`${residente.nombre} ha sido restablecido exitosamente`);
      
      setResidentes(prev => prev.filter(r => r._id !== residente._id));
      if (onResidenteRestored) {
        onResidenteRestored(response.data.residente);
      }
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (error) {
      console.error("Error restoring residente:", error);
      setError(error.response?.data?.error || "Error al restablecer residente");
    } finally {
      setRestoring(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonOffIcon />
          <Typography variant="h6">
            Residentes Inactivos
          </Typography>
          <Chip 
            label={residentes.length} 
            color="secondary" 
            size="small" 
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : residentes.length === 0 ? (
          <Box textAlign="center" py={4}>
            <PersonOffIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay residentes inactivos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Todos los residentes están activos actualmente
            </Typography>
          </Box>
        ) : (
          <List>
            {residentes.map((residente, index) => (
              <div key={residente._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                          {residente.nombre}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <HomeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Casa {residente.casa}
                        </Typography>
                        {residente.playerId && (
                          <Chip 
                            label={`Player ID: ${residente.playerId.slice(0, 8)}...`} 
                            size="small" 
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Restablecer residente">
                      <IconButton
                        onClick={() => handleRestoreResidente(residente)}
                        disabled={restoring === residente._id}
                        color="primary"
                      >
                        {restoring === residente._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <RestoreFromTrashIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < residentes.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        <Button onClick={fetchResidentesInactivos} disabled={loading}>
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
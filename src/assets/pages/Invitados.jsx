import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Person,
  Description,
  Home,
  CameraAlt,
  Upload,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL_PROD;

function Invitados() {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [residencia, setResidencia] = useState("");
  const [FotoVisita, setFotoVisita] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [exito, setExito] = useState("");
  const [fotoError, setFotoError] = useState(false);
  const [residencias, setResidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fraccId = urlParams.get("id");

    if (!fraccId) return;

    fetch(`${API_URL}/api/fraccionamientos/${fraccId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.residencias) {
          const lista = data.residencias
            .filter((c) => c.activa === true)
            .map((c) => c.numero);
          setResidencias(lista);
        }
      })
      .catch((err) => {
        console.error("Error al cargar residencias:", err);
      });
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFotoError(true);
        setErrorGeneral("Solo se permiten imágenes JPG o PNG");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFotoError(true);
        setErrorGeneral("La foto no debe superar los 2MB");
        return;
      }
      setFotoVisita(file);
      setFotoError(false);
      setErrorGeneral("");
    }
  };

  const enviarNotificacion = async (fraccId, residencia, nombre, motivo, fotoUrl) => {
    try {
      setStep(2);
      console.log("Enviando notificación...", { fraccId, residencia, nombre });
      
      const response = await fetch(`${API_URL}/api/notifications/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: nombre,
          body: motivo,
          fraccId: fraccId,
          residencia: residencia,
          foto: fotoUrl
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("Notificación enviada:", data.mensaje);
        return { success: true, notificationId: data.notificationId };
      } else {
        console.error("Error enviando notificación:", data.error);
        return { success: false, error: data.error };
      }
      
    } catch (error) {
      console.error("Error en enviarNotificacion:", error);
      return { success: false, error: "Error de conexión al enviar notificación" };
    }
  };

  const handleSubmit = async () => {
    setErrorGeneral("");
    setExito("");
    
    if (!nombre || !motivo || !residencia) {
      setErrorGeneral("Por favor, completa todos los campos.");
      return;
    }

    if (!FotoVisita) {
      setFotoError(true);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const fraccId = urlParams.get("id");
    if (!fraccId) {
      setErrorGeneral("ID de fraccionamiento no válido.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("motivo", motivo);
    formData.append("residencia", residencia);
    formData.append("FotoVisita", FotoVisita);
    formData.append("origen", "web");

    try {
      setLoading(true);
      setStep(1);
      
      console.log("Registrando visita...");
      const responseVisita = await fetch(`${API_URL}/api/fraccionamientos/${fraccId}/casas/${residencia}/visitas`, {
        method: "POST",
        body: formData,
      });

      const dataVisita = await responseVisita.json();

      if (!responseVisita.ok) {
        setErrorGeneral(dataVisita.error || "Error al registrar visita");
        setLoading(false);
        setStep(1);
        return;
      }

      console.log("Visita registrada:", dataVisita.mensaje);

      const resultadoNotificacion = await enviarNotificacion(
        fraccId,
        residencia,
        nombre,
        motivo,
        dataVisita.foto
      );

      if (resultadoNotificacion.success) {
        setStep(3);
        setExito(`${dataVisita.mensaje}. Notificación enviada a los residentes.`);
        
        setTimeout(() => {
          setNombre("");
          setMotivo("");
          setResidencia("");
          setFotoVisita(null);
          setErrorGeneral("");
          setFotoError(false);
          setStep(1);
          setExito("");
        }, 3000);
        
        console.log("Proceso completado exitosamente");
      } else {
        setExito(dataVisita.mensaje);
        setErrorGeneral(`Advertencia: ${resultadoNotificacion.error || "No se pudo notificar a los residentes"}`);
        
        console.log("Visita registrada pero notificación falló");
      }

    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setErrorGeneral("Error de conexión. Intenta nuevamente.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Progreso:
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={(step / 3) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: step === 3 ? '#4CAF50' : '#81C784',
                borderRadius: 4,
              }
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Chip 
          label="Registrando" 
          variant={step >= 1 ? "filled" : "outlined"}
          color={step >= 1 ? "primary" : "default"}
          size="small"
          sx={{
            bgcolor: step >= 1 ? '#4CAF50' : 'transparent',
            color: step >= 1 ? 'white' : 'inherit',
            borderColor: step >= 1 ? '#4CAF50' : 'inherit'
          }}
        />
        <Chip 
          label="Notificando" 
          variant={step >= 2 ? "filled" : "outlined"}
          color={step >= 2 ? "primary" : "default"}
          size="small"
          sx={{
            bgcolor: step >= 2 ? '#4CAF50' : 'transparent',
            color: step >= 2 ? 'white' : 'inherit',
            borderColor: step >= 2 ? '#4CAF50' : 'inherit'
          }}
        />
        <Chip 
          label="Completado" 
          variant={step >= 3 ? "filled" : "outlined"}
          color={step >= 3 ? "success" : "default"}
          size="small"
          sx={{
            bgcolor: step >= 3 ? '#2E7D32' : 'transparent',
            color: step >= 3 ? 'white' : 'inherit',
            borderColor: step >= 3 ? '#2E7D32' : 'inherit'
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Card 
        sx={{ 
          width: "100%", 
          maxWidth: 600,
          borderRadius: 4, 
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
            color: 'white',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Registro de Visitas
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Completa la información para registrar tu visita
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {loading && renderProgressIndicator()}

          {errorGeneral && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<Error />}
            >
              {errorGeneral}
            </Alert>
          )}
          
          {exito && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<CheckCircle />}
            >
              {exito}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Información Personal */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#4CAF50' }} />
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre completo del visitante"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo de la visita"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      fullWidth
                      disabled={loading}
                      multiline
                      rows={2}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Description sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Destino */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Home sx={{ mr: 1, color: '#4CAF50' }} />
                  Destino
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControl fullWidth disabled={loading}>
                  <InputLabel>Selecciona la residencia</InputLabel>
                  <Select
                    value={residencia}
                    onChange={(e) => setResidencia(e.target.value)}
                    label="Selecciona la residencia"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {residencias.length > 0 ? (
                      residencias.map((r) => (
                        <MenuItem key={r} value={r}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Home sx={{ mr: 1, fontSize: 20 }} />
                            Casa {r}
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        No hay residencias disponibles
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* Foto */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CameraAlt sx={{ mr: 1, color: '#4CAF50' }} />
                  Identificación
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Button
                  component="label"
                  variant={FotoVisita ? "contained" : "outlined"}
                  disabled={loading}
                  startIcon={FotoVisita ? <CheckCircle /> : <Upload />}
                  sx={{
                    width: "100%",
                    height: 60,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: "600",
                    textTransform: "none",
                    border: fotoError ? "2px solid" : "1px solid",
                    borderColor: fotoError ? "#f44336" : FotoVisita ? '#4CAF50' : '#4CAF50',
                    bgcolor: FotoVisita ? '#4CAF50' : 'transparent',
                    color: FotoVisita ? 'white' : '#4CAF50',
                    '&:hover': {
                      bgcolor: FotoVisita ? '#388E3C' : 'rgba(76, 175, 80, 0.04)',
                      borderColor: FotoVisita ? '#388E3C' : '#4CAF50',
                    }
                  }}
                >
                  {FotoVisita ? "Foto cargada correctamente" : "Tomar o subir foto"}
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    hidden
                    onChange={handleFotoChange}
                  />
                </Button>

                {FotoVisita && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      Archivo: {FotoVisita.name}
                    </Typography>
                  </Box>
                )}

                {fotoError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Por favor, agrega una foto como identificación
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={loading || fotoError || !nombre || !motivo || !residencia || !FotoVisita}
                onClick={handleSubmit}
                sx={{
                  width: "100%",
                  height: 56,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.6)",
                  },
                  "&:disabled": {
                    background: "grey.300",
                    boxShadow: "none",
                  }
                }}
              >
                {loading ? "Procesando solicitud..." : "Registrar Visita"}
              </Button>
            </Grid>

            {loading && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.08)', border: '1px solid', borderColor: 'rgba(76, 175, 80, 0.3)' }}>
                  <Typography variant="body2" textAlign="center" sx={{ color: '#2E7D32', fontWeight: 500 }}>
                    {step === 1 && "Registrando tu visita en el sistema..."}
                    {step === 2 && "Enviando notificación a los residentes..."}
                    {step === 3 && "Proceso completado exitosamente"}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Invitados;
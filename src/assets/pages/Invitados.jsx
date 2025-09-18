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
} from "@mui/material";
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fraccId = urlParams.get("id");
    const casaParam = urlParams.get("casa");

    if (!fraccId) {
      setErrorGeneral("QR sin fraccionamiento válido");
      return;
    }

    fetch(`${API_URL}/api/fraccionamientos/${fraccId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.residencias) {
          const lista = data.residencias
            .filter((c) => c.activa === true)
            .map((c) => c.numero);
          setResidencias(lista);
          
          if (casaParam && lista.includes(parseInt(casaParam))) {
            setResidencia(casaParam);
          }
        }
      })
      .catch((err) => {
        console.error("Error al cargar residencias:", err);
        setErrorGeneral("Error al cargar fraccionamiento");
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
      setFotoVisita(file);
      setFotoError(false);
      setErrorGeneral("");
    }
  };

  const enviarNotificacion = async (fraccId, residencia, nombre, motivo, fotoUrl) => {
    try {
      
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
        return { success: true, notificationId: data.notificationId };
      } else {
        return { success: false, error: data.error };
      }
      
    } catch (error) {
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

    
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", borderRadius: 5, boxShadow: 6 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="black">
            Registro de Visitas
          </Typography>

          {errorGeneral && <Alert severity="error">{errorGeneral}</Alert>}
          {exito && <Alert severity="success">{exito}</Alert>}

          <TextField
            label="Nombre del visitante"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 3,
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputLabel-root": { color: "black" },
            }}
          />
          <TextField
            label="Motivo de la visita"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: 3,
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputLabel-root": { color: "black" },
            }}
          />

          <FormControl fullWidth disabled={loading}>
            <InputLabel sx={{ color: "black" }}>Residencia</InputLabel>
            <Select
              value={residencia}
              onChange={(e) => setResidencia(e.target.value)}
              sx={{
                borderRadius: 3,
                color: "black",
                ".MuiSelect-icon": { color: "black" },
              }}
            >
              {residencias.length > 0 ? (
                residencias.map((r) => (
                  <MenuItem key={r} value={r} sx={{ color: "black" }}>
                    Casa {r}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ color: "#4a4a4a" }}>
                  No hay residencias registradas
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            component="label"
            variant="outlined"
            disabled={loading}
            sx={{
              borderRadius: "30px",
              height: "3.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              width: "100%",
              color: "black",
              borderColor: "black",
              "&:hover": {
                backgroundColor: "#e0e0e0",
                borderColor: "black",
              },
            }}
          >
            {FotoVisita ? "Foto cargada" : "Tomar selfie"}
            <input
              type="file"
              accept="image/*"
              capture="user"
              hidden
              onChange={handleFotoChange}
            />
          </Button>

          {fotoError && (
            <Typography color="error" textAlign="center" fontWeight="bold">
              Agrega una selfie como identificación
            </Typography>
          )}

          <Box textAlign="center">
            <Button
              variant="contained"
              disabled={loading || fotoError}
              sx={{
                backgroundColor: fotoError ? "error.main" : "success.main",
                "&:hover": {
                  backgroundColor: fotoError ? "error.dark" : "success.dark",
                },
                borderRadius: "30px",
                height: "3.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                width: "70%",
              }}
              onClick={handleSubmit}
            >
              {loading ? "Procesando..." : "Registrar Visita"}
            </Button>
          </Box>

          {loading && (
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Registrando visita y enviando notificación...
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Invitados;
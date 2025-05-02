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
import { useState } from "react";

function Invitados() {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [residencia, setResidencia] = useState("");
  const [fotoDni, setFotoDni] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [fotoError, setFotoError] = useState(false); 

  const residencias = [
    "Casa 1", "Casa 2", "Casa 3",
    "Depto 101", "Depto 102", "Depto 201", "Depto 202"
  ];

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoDni(file);
      setFotoError(false); 
    }
  };

  const handleSubmit = async () => {
    if (!fotoDni) {
      setFotoError(true); 
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("motivo", motivo);
    formData.append("residencia", residencia);
    formData.append("fotoDni", fotoDni);

    try {
      const response = await fetch("http://localhost:5002/api/auth/visitas", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorGeneral(data.error || "Error desconocido");
        return;
      }

      setNombre("");
      setMotivo("");
      setResidencia("");
      setFotoDni(null);
      setErrorGeneral("");
      setFotoError(false);
    } catch (err) {
      setErrorGeneral("Error al mandar la solicitud");
    }
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

          <TextField
            label="Nombre del visitante"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            sx={{ 
              borderRadius: 3,
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
            }}
          />
          <TextField
            label="Motivo de la visita"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            fullWidth
            sx={{ 
              borderRadius: 3,
              '& .MuiInputBase-input': { color: 'black' },
              '& .MuiInputLabel-root': { color: 'black' },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: "black" }}>Residencia</InputLabel>
            <Select
              value={residencia}
              onChange={(e) => setResidencia(e.target.value)}
              sx={{ 
                borderRadius: 3,
                color: "black",
                '.MuiSelect-icon': { color: 'black' },
              }}
            >
              {residencias.map((r) => (
                <MenuItem key={r} value={r} sx={{ color: "black" }}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            component="label"
            variant="outlined"
            sx={{
              borderRadius: "30px",
              height: "3.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              width: "100%",
              color: "black",
              borderColor: "black",
              '&:hover': {
                backgroundColor: "#e0e0e0",
                borderColor: "black",
              },
            }}
          >
            {fotoDni ? "Foto cargada" : "Foto del DNI"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleFotoChange}
            />
          </Button>

          {fotoError && (
            <Typography color="red" textAlign="center" fontWeight="bold">
              Agrega una identificación
            </Typography>
          )}

          <Box textAlign="center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: fotoError ? "red" : "success.main",
                "&:hover": {
                  backgroundColor: fotoError ? "#cc0000" : "success.dark",
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
              Registrar Visita
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Invitados;
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
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Invitados() {
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [residencia, setResidencia] = useState("");
  const [fotoDni, setFotoDni] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [fotoError, setFotoError] = useState(false);
  const [searchParams] = useSearchParams();
  const [fraccId, setFraccId] = useState("");
  const [residencias, setResidencias] = useState([]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setFraccId(id);
      fetch(`http://localhost:5002/api/fracc/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.residencias) {
            const residenciasNumeros = data.residencias.map((casa) => String(casa.numero));
            setResidencias(residenciasNumeros);
          }
        })
        .catch(err => {
          console.error("Error al cargar residencias:", err);
          setErrorGeneral("No se pudieron cargar las residencias.");
        });
    } else {
      setErrorGeneral("ID de fraccionamiento no encontrado.");
    }
  }, [searchParams]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoDni(file);
      setFotoPreview(URL.createObjectURL(file)); 
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
    formData.append("fraccId", fraccId);

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
          />
          <TextField
            label="Motivo de la visita"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Residencia</InputLabel>
            <Select
              value={residencia}
              onChange={(e) => setResidencia(e.target.value)}
            >
              {residencias.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ textAlign: "center" }}>
          <Button
            component="label"
            variant="outlined"
            sx={{ borderRadius: "30px", mb: 1 }}
          >
            {fotoDni ? "Cambiar selfie" : "Tomar selfie"}
            <input
              type="file"
              accept="image/*"
              capture="user"
              hidden
              onChange={handleFotoChange}
            />
          </Button>

          {fotoPreview && (
            <Box>
              <img
                src={fotoPreview}
                alt="Vista previa"
                style={{ width: "100%", borderRadius: 10, marginBottom: 10 }}
              />
              <Button
                color="error"
                size="small"
                onClick={() => {
                  setFotoDni(null);
                  setFotoPreview("");
                }}
              >
                Eliminar selfie
              </Button>
            </Box>
          )}

          {fotoError && (
            <Typography color="red" fontWeight="bold" mt={1}>
              Agrega una identificación
            </Typography>
          )}
        </Box>

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
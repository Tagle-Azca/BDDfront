import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import eskayser from "../img/Eskayser.png";

const API_URL = process.env.REACT_APP_API_URL_PROD;

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fracc/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();
      console.log("🔍 Login response status:", response.status);
      console.log("🔍 Login response body:", data);

      if (!response.ok) {
        setError(data.error || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.usuario === "admin Eskayser") {
        navigate("/admin");
      } else {
        localStorage.setItem("fraccId", data.user._id);
        navigate(`/dashboard/${data.user._id}`);
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <img
          src={eskayser}
          alt="Logo"
          style={{ width: 300, height: 100, marginBottom: 10 }}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "green" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
            }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "green" },
                "&.Mui-focused fieldset": { borderColor: "green" },
              },
            }}
          />
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ fontWeight: "bold" }}
            onClick={handleLogin}
          >
            Ingresar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
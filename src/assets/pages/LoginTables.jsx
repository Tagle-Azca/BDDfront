import React, { useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import Logo from "../img/Eskayser.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!correo || !contrasena) {
      setError("Correo y contraseña son obligatorios");
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });
      
      const data = await response.json();
      

      if (response.ok) {
        localStorage.setItem("Usuario", data.usuario); 
        navigate("/"); 
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al procesar el inicio de sesión");
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 28,
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box textAlign="center">
        <img
          src={Logo}
          alt="Logo"
          style={{ height: "100px", marginBottom: "10px" }}
        />
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          variant="outlined"
          fullWidth
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          fullWidth
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        {error && (
          <Box sx={{ color: "red", mt: 2, textAlign: "center" }}>{error}</Box>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#00b34e" }}
        >
          Ingresar
        </Button>
      </form>
    </Box>
  );
};

export default Login;
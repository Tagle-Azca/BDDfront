import React, { useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import Logo from "../img/Eskayser.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5002/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: email, contraseña: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("fraccionamiento", data.user.fraccionamiento);
        navigate("/fracc");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error al iniciar sesión. Inténtalo nuevamente.");
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
          label="Correo Electrónico"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
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

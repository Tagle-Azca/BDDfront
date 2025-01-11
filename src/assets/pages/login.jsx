import React, { useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import Logo from "../img/Eskayser.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "admin" && password === "admin") {
      navigate("/fracc");
    } else {
      alert("Credenciales incorrectas");
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

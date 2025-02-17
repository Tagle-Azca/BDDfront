import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const ContactoModal = ({ open, handleClose, contacto }) => {

  const [contactoData, setContactoData] = useState({
    nombre: "",
    usuario: "",
    correo: "",
    telefono: "",
    direccion: "",
    estado: "",
  });


  useEffect(() => {
    if (contacto) {
      setContactoData({
        nombre: contacto.fraccionamiento || "",
        usuario: contacto.usuario || "",
        correo: contacto.correo || "",
        telefono: contacto.telefono || "",
        direccion: contacto.direccion || "",
        estado: contacto.estado || "",
      });
    }
  }, [contacto]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/fracc/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactoData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Contacto agregado con éxito");
        handleClose(); 
      } else {
        alert(data.error || "Error al agregar contacto");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Información del Contacto</DialogTitle>
      <DialogContent>
        <TextField
          label="Fraccionamiento"
          name="nombre"
          value={contactoData.nombre}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Usuario"
          name="usuario"
          value={contactoData.usuario}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correo"
          name="correo"
          value={contactoData.correo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="email"
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={contactoData.telefono}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="tel"
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={contactoData.direccion}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Estado"
          name="estado"
          value={contactoData.estado}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactoModal;
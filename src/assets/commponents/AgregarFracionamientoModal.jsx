import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import InputField from "./TextField";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002/api/fracc/";

const AgregarFraccionamientoModal = ({ open, handleClose, fetchData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    contrasena: "",
    direccion: "",
    correo: "",
    telefono: "",
    estado: "activo",
  });
//pruebas
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/fracc/add`, formData);
      console.log("✅ Fraccionamiento agregado:", response.data);
      fetchData();
      handleClose();
    } catch (error) {
      console.error("❌ Error al agregar fraccionamiento:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Fraccionamiento</DialogTitle>
      <DialogContent>
        <InputField label="Fraccionamiento" name="nombre" value={formData.nombre} onChange={handleInputChange} />
        <InputField label="Usuario" name="usuario" value={formData.usuario} onChange={handleInputChange} />
        <InputField label="Contraseña" name="contrasena" type="password" value={formData.contraseña} onChange={handleInputChange} />
        <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
        <InputField label="Correo" name="correo" type="email" value={formData.correo} onChange={handleInputChange} />
        <InputField label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleInputChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Agregar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarFraccionamientoModal;
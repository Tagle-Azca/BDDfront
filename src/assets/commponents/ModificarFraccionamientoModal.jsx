import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import InputField from "./TextField";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002/api/fracc/update/";

const EditarFraccionamientoModal = ({ open, handleClose, fraccionamiento, fetchData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    direccion: "",
    correo: "",
    telefono: "",
    estado: "activo",
  });

  useEffect(() => {
    if (fraccionamiento) {
      setFormData({
        nombre: fraccionamiento.nombre || "",
        usuario: fraccionamiento.usuario || "",
        direccion: fraccionamiento.direccion || "",
        correo: fraccionamiento.correo || "",
        telefono: fraccionamiento.telefono || "",
        estado: fraccionamiento.estado || "activo",
      });
    }
  }, [fraccionamiento]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!fraccionamiento?._id) {
      console.error("❌ No se puede actualizar: ID no válido");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/update/${fraccionamiento._id}`, formData);
      console.log("✅ Fraccionamiento actualizado:", response.data);
      fetchData(); 
      handleClose();
    } catch (error) {
      console.error("❌ Error al actualizar fraccionamiento:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Fraccionamiento</DialogTitle>
      <DialogContent>
        <InputField label="Fraccionamiento" name="nombre" value={formData.nombre} onChange={handleInputChange} />
        <InputField label="Usuario" name="usuario" value={formData.usuario} onChange={handleInputChange} />
        <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
        <InputField label="Correo" name="correo" type="email" value={formData.correo} onChange={handleInputChange} />
        <InputField label="Teléfono" name="telefono" type="tel" value={formData.telefono} onChange={handleInputChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleUpdate} color="primary">Actualizar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarFraccionamientoModal;
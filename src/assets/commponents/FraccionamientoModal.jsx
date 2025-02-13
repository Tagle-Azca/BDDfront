import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import InputField from "./TextField";

const FraccionamientoModal = ({ open, handleClose, handleSave, formData, handleInputChange, editMode }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? "Editar Fraccionamiento" : "Agregar Fraccionamiento"}</DialogTitle>
      <DialogContent>
        <InputField label="Fraccionamiento" name="nombre" value={formData.nombre || ""} onChange={handleInputChange} />
        <InputField label="Usuario" name="usuario" value={formData.usuario || ""} onChange={handleInputChange} />
        <InputField label="Dirección" name="direccion" value={formData.direccion || ""} onChange={handleInputChange} />
        <InputField label="Correo" name="correo" value={formData.correo || ""} onChange={handleInputChange} type="email" />
        <InputField label="Teléfono" name="telefono" value={formData.telefono || ""} onChange={handleInputChange} type="tel" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          {editMode ? "Actualizar" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FraccionamientoModal;
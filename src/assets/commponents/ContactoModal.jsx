import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ContactoModal = ({ open, handleClose, contacto }) => {
  if (!contacto) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Información de Contacto</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1"><strong>Dirección:</strong> {contacto.direccion || "No disponible"}</Typography>
        <Typography variant="subtitle1"><strong>Correo:</strong> {contacto.correo || "No disponible"}</Typography>
        <Typography variant="subtitle1"><strong>Teléfono:</strong> {contacto.telefono || "No disponible"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactoModal;
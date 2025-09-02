import React from "react";
import { Chip } from "@mui/material";

const StatusChip = ({ 
  status, 
  variant = "filled",
  size = "small" 
}) => {
  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case "activo":
        return {
          label: "Activo",
          color: "success",
        };
      case "inactivo":
        return {
          label: "Inactivo", 
          color: "error",
        };
      case "bloqueada":
        return {
          label: "Bloqueada",
          color: "error",
        };
      case "pendiente":
        return {
          label: "Pendiente",
          color: "warning",
        };
      case "vencido":
        return {
          label: "Vencido",
          color: "error",
        };
      case "por vencer":
        return {
          label: "Por vencer",
          color: "warning",
        };
      default:
        return {
          label: status || "Desconocido",
          color: "default",
        };
    }
  };

  const { label, color } = getStatusConfig(status);

  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size={size}
      sx={{
        fontWeight: 500,
        minWidth: 80,
        textTransform: 'capitalize'
      }}
    />
  );
};

export default StatusChip;
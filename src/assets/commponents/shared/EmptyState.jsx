import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import {
  Home as HomeIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const EmptyState = ({ 
  type = "no-data", 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon: CustomIcon 
}) => {
  const getEmptyStateConfig = (type) => {
    switch (type) {
      case "no-data":
        return {
          icon: CustomIcon || HomeIcon,
          title: title || "No hay casas registradas",
          description: description || "Comienza agregando la primera casa a tu fraccionamiento para gestionar residentes y visitas.",
          actionLabel: actionLabel || "Agregar Primera Casa",
          color: "primary",
        };
      case "no-results":
        return {
          icon: CustomIcon || SearchIcon,
          title: title || "No se encontraron resultados",
          description: description || "Intenta ajustar los filtros de búsqueda o revisa los criterios aplicados.",
          actionLabel: actionLabel || "Limpiar Filtros",
          color: "secondary",
        };
      default:
        return {
          icon: CustomIcon || HomeIcon,
          title: title || "Sin contenido",
          description: description || "No hay información disponible en este momento.",
          actionLabel: actionLabel,
          color: "primary",
        };
    }
  };

  const { icon: Icon, title: stateTitle, description: stateDescription, actionLabel: stateActionLabel, color } = getEmptyStateConfig(type);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 3,
        minHeight: 300,
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mb: 3,
          backgroundColor: `${color}.light`,
          color: `${color}.main`,
        }}
      >
        <Icon sx={{ fontSize: 40 }} />
      </Avatar>
      
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "text.primary",
          maxWidth: 400,
        }}
      >
        {stateTitle}
      </Typography>
      
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          mb: 4,
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        {stateDescription}
      </Typography>
      
      {stateActionLabel && onAction && (
        <Button
          variant="contained"
          color={color}
          onClick={onAction}
          startIcon={type === "no-data" ? <AddIcon /> : undefined}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          {stateActionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
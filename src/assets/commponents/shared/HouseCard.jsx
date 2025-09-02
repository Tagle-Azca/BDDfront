import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  QrCode as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import StatusChip from "./StatusChip";

const HouseCard = ({
  house,
  onAddResident,
  onToggleActive,
  onShowQR,
  sx = {},
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
        border: house.activa ? "2px solid #e8f5e8" : "2px solid #ffebee",
        ...sx,
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: house.activa ? "success.main" : "error.main",
              mr: 2,
            }}
          >
            <HomeIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Casa #{house.numero}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {house.propietario || "Sin propietario"}
            </Typography>
          </Box>
          <StatusChip
            status={house.activa ? "activo" : "bloqueada"}
            variant="filled"
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <GroupIcon color="action" fontSize="small" />
          <Typography variant="body2" color="textSecondary">
            {house.residentes.length} residente{house.residentes.length !== 1 ? "s" : ""}
          </Typography>
          {house.residentes.length > 0 && (
            <Chip
              label={`${house.residentes.length}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {house.residentes.length > 0 && (
          <Button
            onClick={handleExpandClick}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
            color="primary"
            sx={{ mb: 1, textTransform: "none" }}
          >
            {expanded ? "Ocultar" : "Ver"} residentes
          </Button>
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List dense sx={{ bgcolor: "background.paper", borderRadius: 1, mt: 1 }}>
            {house.residentes.map((residente, index) => (
              <ListItem key={index} divider={index < house.residentes.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={residente.nombre}
                  secondary={residente.relacion || "Sin especificar"}
                  primaryTypographyProps={{ fontSize: "0.875rem" }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 1, gap: 0.5 }}>
        <Tooltip title="Mostrar código QR">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onShowQR(house)}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              "&:hover": { bgcolor: "primary.light", color: "white" },
            }}
          >
            <QrCodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Agregar residente">
          <IconButton
            size="small"
            color="success"
            onClick={() => onAddResident(house)}
            sx={{
              border: "1px solid",
              borderColor: "success.main",
              "&:hover": { bgcolor: "success.main", color: "white" },
            }}
          >
            <PersonAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={house.activa ? "Desactivar casa" : "Activar casa"}>
          <IconButton
            size="small"
            color={house.activa ? "success" : "error"}
            onClick={() => onToggleActive(house.numero)}
            sx={{
              border: "1px solid",
              borderColor: house.activa ? "success.main" : "error.main",
              "&:hover": {
                bgcolor: house.activa ? "success.main" : "error.main",
                color: "white",
              },
            }}
          >
            <LockIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default HouseCard;
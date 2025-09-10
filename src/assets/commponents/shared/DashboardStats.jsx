import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "primary", 
  trend = null,
  progress = null 
}) => (
  <Card
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${color === 'primary' ? '#1976d2' : 
        color === 'success' ? '#2e7d32' : 
        color === 'error' ? '#d32f2f' : 
        '#0288d1'} 0%, ${color === 'primary' ? '#1565c0' : 
        color === 'success' ? '#1b5e20' : 
        color === 'error' ? '#c62828' : 
        '#2e7d32'} 100%)`,
      color: "white",
      position: "relative",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      },
      transition: "all 0.3s ease",
    }}
  >
    <CardContent sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: "block" }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            width: 56,
            height: 56,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Avatar>
      </Box>
      
      {progress !== null && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "rgba(255,255,255,0.8)",
              },
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: "block" }}>
            {progress.toFixed(0)}% del total
          </Typography>
        </Box>
      )}
    </CardContent>
    
    <Box
      sx={{
        position: "absolute",
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.1)",
        zIndex: 0,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.05)",
        zIndex: 0,
      }}
    />
  </Card>
);

const DashboardStats = ({ data = [] }) => {
  const stats = React.useMemo(() => {
    const total = data.length;
    const activas = data.filter((casa) => casa.activa).length;
    const bloqueadas = data.filter((casa) => !casa.activa).length;
    const totalResidentes = data.reduce((sum, casa) => sum + casa.residentes.length, 0);

    return [
      {
        title: "Total de Casas",
        value: total,
        icon: HomeIcon,
        color: "primary",
      },
      {
        title: "Casas Activas",
        value: activas,
        icon: CheckCircleIcon,
        color: "success",
        progress: total > 0 ? (activas / total) * 100 : 0,
      },
      {
        title: "Casas Bloqueadas",
        value: bloqueadas,
        icon: BlockIcon,
        color: "error",
        progress: total > 0 ? (bloqueadas / total) * 100 : 0,
      },
      {
        title: "Total Residentes",
        value: totalResidentes,
        icon: PeopleIcon,
        color: "info",
        trend: total > 0 ? `${(totalResidentes / total).toFixed(1)} promedio por casa` : "0 promedio",
      },
    ];
  }, [data]);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
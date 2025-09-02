import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

const StatCard = ({ label, value, color = "primary", trend = null }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {label}
          </Typography>
          <Typography variant="h4" component="div" color={`${color}.main`}>
            {value || 0}
          </Typography>
          {trend && (
            <Chip 
              label={trend} 
              size="small" 
              color={trend.startsWith('+') ? 'success' : 'error'}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminHeader = ({ 
  title = "Panel Administrativo", 
  subtitle = null,
  stats = [] 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {stats.length > 0 && (
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminHeader;
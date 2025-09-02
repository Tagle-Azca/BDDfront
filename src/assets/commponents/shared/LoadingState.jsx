import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const SkeletonCard = () => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>
      <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </CardContent>
  </Card>
);

const LoadingState = ({ 
  type = "spinner", 
  message = "Cargando...",
  count = 6 
}) => {
  if (type === "cards") {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }, (_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === "stats") {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={60} height={32} />
                  </Box>
                  <Skeleton variant="circular" width={48} height={48} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        textAlign: "center",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          mb: 2,
          color: "primary.main",
        }}
      />
      <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
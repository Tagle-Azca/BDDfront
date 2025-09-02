import React from "react";
import { Box } from "@mui/material";
import Navbar from "../commponents/Navbar";
import AdminTable from "../commponents/AdminTable";

const MainPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <AdminTable />
    </Box>
  );
};

export default MainPage;

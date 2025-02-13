import React from "react";
import Navbar from "../commponents/Navbar";
import DataTablePremium from "../commponents/table";
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: "50px", marginTop:"-2.5rem"}}>
        <DataTablePremium />
      </Box>
    </Box>
  );
};

export default MainPage;

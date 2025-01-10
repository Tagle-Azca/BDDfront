import React from "react";
import Navbar from "../commponents/Navbar";
import DataTablePremium from "../commponents/table";
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: "50px" }}>
        <DataTablePremium />
      </Box>
    </Box>
  );
};

export default MainPage;

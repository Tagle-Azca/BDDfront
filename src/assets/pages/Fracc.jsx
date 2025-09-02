import React from "react";
import Navbar from "../commponents/Navbar";
import ResidenceTable from "../commponents/ResidenceTable"; 
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: "50px" }}>
        <ResidenceTable /> 
      </Box>
    </Box>
  );
};

export default MainPage;
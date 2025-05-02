import React from "react";
import Navbar from "../commponents/Navbar";
import EskayserAdminTable from "../commponents/EskayserAdminTable";
import { Box } from "@mui/material";

const MainPage = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: "50px", marginTop:"-2.5rem"}}>
        <EskayserAdminTable />
      </Box>
    </Box>
  );
};

export default MainPage;

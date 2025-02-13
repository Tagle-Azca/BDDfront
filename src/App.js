import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginTables from "./assets/pages/LoginTables";
import Main from "./assets/pages/Admin";
import Fracc from "./assets/pages/Fracc";

import { SpeedInsights } from "@vercel/speed-insights/react";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginTables />} />
        <Route path="/" element={<Main />} />
        <Route path="/Fracc" element={<Fracc />} />
        <Route path="*" element={<h1>404 - Página no encontrada, regresar a https://ingresos-lime.vercel.app</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

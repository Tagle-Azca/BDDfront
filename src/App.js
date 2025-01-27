import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/login";
import Fracc from "./assets/pages/Fracc";
import { SpeedInsights } from "@vercel/speed-insights/react";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Fracc />} />
        <Route path="*" element={<h1>404 - Página no encontrada, regresar a https://ingresos-lime.vercel.app</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

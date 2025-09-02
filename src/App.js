import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/pages/Login";
import FraccDashboard from "./assets/pages/Dashboard";
import AdminDashboard from "./assets/pages/EskayserAdmin";
import Invitados from "./assets/pages/Invitados";
import ReportesAdmin from "./assets/pages/ReportesAdmin";
import AvisoPrivacidad from "./assets/pages/AvisoPrivacidad";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/:id" element={<FraccDashboard />} />
        <Route path="/reportes/:id" element={<ReportesAdmin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/Visitas" element={<Invitados />} />
        <Route path="/AvisoPrivacidad" element={<AvisoPrivacidad />} />
      </Routes>
    </Router>
  );
}   

export default App;
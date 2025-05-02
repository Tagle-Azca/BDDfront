import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/pages/Login";
import FraccDashboard from "./assets/pages/Dashboard";
import AdminDashboard from "./assets/pages/Admin";
import Invitados from "./assets/pages/Invitados"

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard/:id" element={<FraccDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/Visitas" element={<Invitados />} />
      </Routes>
    </Router>
  );
}

export default App;

//cambios
//2
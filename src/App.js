import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Fraccionamientos from "./assets/pages/Fracc.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Fraccionamientos />} />

        <Route path="/Fraccionamientos" element={<Fraccionamientos />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./assets/pages/login";
import Fracc from "./assets/pages/Fracc";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/fracc" element={<Fracc />} />
      </Routes>
    </Router>
  );
};

export default App;

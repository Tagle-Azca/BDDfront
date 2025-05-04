import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002";

export default function Dashboard() {
  const [fraccionamiento, setFraccionamiento] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      console.error("No hay usuario logueado");
      return;
    }
    console.log("ID recibido en Dashboard:", user._id);
    fetchFraccionamiento(user._id);
  }, []);

  const fetchFraccionamiento = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/fracc/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Datos recibidos:", response.data);
      setFraccionamiento(response.data);
    } catch (error) {
      console.error("❌ Error al obtener el fraccionamiento:", error);
    }
  };

  if (!fraccionamiento) return <h2>Cargando...</h2>;

  return (
    <div>
      <h2>Dashboard - {fraccionamiento.nombre}</h2>
      <p>Usuario: {fraccionamiento.usuario}</p>
      <p>Dirección: {fraccionamiento.direccion}</p>
      <p>Teléfono: {fraccionamiento.telefono}</p>
    </div>
  );
}
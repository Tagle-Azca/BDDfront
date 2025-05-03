import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002/api/fracc";

export default function Dashboard() {
  const { id } = useParams(); // ID del fraccionamiento
  const [fraccionamiento, setFraccionamiento] = useState(null);

  useEffect(() => {
    console.log("ID recibido en Dashboard:", id);
    fetchFraccionamiento();
  }, [id]);

  const fetchFraccionamiento = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
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
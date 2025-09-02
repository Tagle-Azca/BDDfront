import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD;

export const useResidences = () => {
  const [residences, setResidences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    const fraccId = localStorage.getItem("fraccId");
    if (!fraccId) {
      console.warn("ID de fraccionamiento no encontrado en localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/residencias/get-house`);
      const data = response.data
        .filter((item) => item.fraccionamientoId === fraccId)
        .map((item, index) => ({
          id: index + 1,
          _id: item._id,
          direccion: item.direccion,
          fraccionamiento: item.fraccionamiento,
          residentes: item.residentes.map((residente) => ({
            nombre: residente.nombre,
            telefono: residente.telefono,
            _id: residente._id,
          })),
        }));
      
      setResidences(data);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addResident = async (residenceId, newResident) => {
    try {
      const residence = residences.find(r => r._id === residenceId);
      const response = await axios.put(
        `${API_URL}/api/residencias/update-residentes/${residenceId}`,
        { residentes: [...residence.residentes, newResident] }
      );

      const updatedResidence = response.data.data;
      setResidences(prev => 
        prev.map(residence => 
          residence._id === updatedResidence._id
            ? { ...residence, residentes: updatedResidence.residentes }
            : residence
        )
      );
    } catch (error) {
      console.error("Error al agregar el residente:", error);
      throw error;
    }
  };

  return {
    residences,
    loading,
    addResident,
    refetch: fetchResidences,
  };
};

export default useResidences;
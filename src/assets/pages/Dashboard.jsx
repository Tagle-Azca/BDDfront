import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_PROD || "http://localhost:5002";

export default function FraccAdminTable() {
  const [data, setData] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_URL}/api/fracc/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Filtrar por fraccionamiento logueado y estructurar residentes
      const data = response.data.residencias.map((item, index) => ({
        id: index + 1,
        numero: item.numero,
        propietario: item.propietario,
        telefono: item.telefono,
        residentes: item.residentes.map((res) => ({
          nombre: res.nombre,
          edad: res.edad,
          relacion: res.relacion,
          telefono: res.telefono || "N/A"
        })),
      }));

      setData(data);
    } catch (error) {
      console.error("Error fetching residencias:", error);
    }
  };

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Número</th>
          <th>Propietario</th>
          <th>Teléfono</th>
          <th>Número de Residentes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((casa) => (
          <tr key={casa.id}>
            <td>{casa.numero}</td>
            <td>{casa.propietario}</td>
            <td>{casa.telefono}</td>
            <td>{casa.residentes.length}</td>
            <td>
              <button onClick={() => toggleRow(casa.id)}>
                {openRow === casa.id ? "Ocultar Residentes" : "Ver Residentes"}
              </button>
            </td>
          </tr>
        ))}
        {data.map(
          (casa) =>
            openRow === casa.id && (
              <tr key={`residentes-${casa.id}`}>
                <td colSpan="5">
                  <ul>
                    {casa.residentes.map((residente, idx) => (
                      <li key={idx}>
                        {residente.nombre} ({residente.relacion}) - {residente.telefono}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
}
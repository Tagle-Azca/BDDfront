import { useEffect, useState } from "react";

const FraccTable = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/auth/admins");
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error("Error al obtener administradores:", error);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div>
      <h2>Lista de Administradores</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Fraccionamiento</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan="3">No hay administradores registrados</td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.usuario}</td>
                <td>{admin.correo}</td>
                <td>{admin.fraccionamiento?.nombre || "No asignado"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FraccTable;
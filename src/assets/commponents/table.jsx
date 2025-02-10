import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Switch,
  Button,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ingresosbackend.onrender.com"
    : "http://localhost:5002";

export default function StickyHeadTable() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/fracc/fraccionamientos`);
      const data = response.data.map((item, index) => ({
        id: index + 1,
        _id: item._id,
        usuario: item.usuario,
        fraccionamiento: item.fraccionamiento,
        estado: item.Estado,
        correo: item.correo,
        fechaExpedicion: new Date(item.fechaExpedicion).toLocaleDateString(),
      }));
      setRows(data);
      setFilteredRows(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filteredData = rows.filter((row) =>
      Object.values(row).some(
        (field) =>
          typeof field === "string" && field.toLowerCase().includes(value)
      )
    );

    setFilteredRows(filteredData);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEstadoChange = async (id, currentEstado) => {
    const newEstado = currentEstado === "activo" ? "inactivo" : "activo";
    try {
      await axios.patch(`${API_URL}/api/fracc/update/${id}`, {
        Estado: newEstado,
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === id ? { ...row, estado: newEstado } : row
        )
      );
      setFilteredRows((prevRows) =>
        prevRows.map((row) =>
          row._id === id ? { ...row, estado: newEstado } : row
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  };

  const columns = [
    { id: "id", label: "ID", minWidth: 50 },
    { id: "usuario", label: "Usuario", minWidth: 150 },
    { id: "fraccionamiento", label: "Fraccionamiento", minWidth: 180 },
    {
      id: "estado",
      label: "Estado",
      minWidth: 100,
      align: "center",
      render: (row) => (
        <Switch
          checked={row.estado === "activo"}
          onChange={() => handleEstadoChange(row._id, row.estado)}
        />
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      minWidth: 100,
      align: "center",
      render: (row) => (
        <>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <QrCodeIcon />
          </IconButton>
        </>
      ),
    },
    { id: "correo", label: "Correo", minWidth: 200 },
    { id: "fechaExpedicion", label: "Fecha de Expedición", minWidth: 150 },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" style={{ backgroundColor: "#00b34e", borderRadius:'40rem', height:'2.5rem'}}>
          Agregar Nuevo
        </Button>
        <TextField
          label="Buscar..."
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {column.render ? column.render(row) : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

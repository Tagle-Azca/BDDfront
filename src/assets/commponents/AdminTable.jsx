import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

import DataTable from "./shared/DataTable";
import AdminHeader from "./shared/AdminHeader";
import SearchAndActions from "./shared/SearchAndActions";
import StatusChip from "./shared/StatusChip";
import AgregarFraccionamientoModal from "./AgregarFracionamientoModal";
import EditarFraccionamientoModal from "./ModificarFraccionamientoModal";
import ContactoModal from "./ContactoModal";

const API_URL = `${process.env.REACT_APP_API_URL_PROD}/api/fraccionamientos`;

const AdminTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openContactoModal, setOpenContactoModal] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  
  const qrRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      const data = response.data.map((item, index) => ({
        id: index + 1,
        _id: item._id,
        fraccionamiento: item.nombre || "Sin nombre",
        usuario: item.usuario || "No asignado",
        direccion: item.direccion || "Sin dirección",
        correo: item.correo || "Sin correo",
        telefono: item.telefono || "Sin teléfono",
        estado: item.estado || "activo",
        fechaExpiracion: item.fechaExpiracion ? new Date(item.fechaExpiracion).toLocaleDateString() : "No disponible",
        qr: item.qrVisitas || "No disponible",
      }));

      setRows(data);
    } catch (error) {
      console.error("❌ Error al obtener los fraccionamientos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = searchValue === "" || 
        Object.values(row).some(val => 
          typeof val === "string" && 
          val.toLowerCase().includes(searchValue.toLowerCase())
        );
      
      const matchesStatus = statusFilter === "" || row.estado === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchValue, statusFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const activos = rows.filter(r => r.estado === "activo").length;
    const inactivos = rows.filter(r => r.estado === "inactivo").length;
    const proximosVencer = rows.filter(r => {
      if (!r.fechaExpiracion || r.fechaExpiracion === "No disponible") return false;
      const expDate = new Date(r.fechaExpiracion);
      const today = new Date();
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;

    return [
      { label: "Total Fraccionamientos", value: total, color: "primary" },
      { label: "Activos", value: activos, color: "success" },
      { label: "Inactivos", value: inactivos, color: "error" },
      { label: "Por Vencer (30 días)", value: proximosVencer, color: "warning" },
    ];
  }, [rows]);

  const columns = [
    { id: "fraccionamiento", label: "Fraccionamiento" },
    { id: "usuario", label: "Usuario" },
    { 
      id: "estado", 
      label: "Estado",
      render: (value) => <StatusChip status={value} />
    },
    { id: "fechaExpiracion", label: "Fecha de Expiración" },
    { 
      id: "contacto", 
      label: "Contacto",
      render: (_, row) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOpenContactoModal(row)}
        >
          Ver Contacto
        </Button>
      )
    },
  ];

  const actions = [
    {
      icon: QrCodeIcon,
      onClick: (row) => handleQrModal(row),
      color: "primary",
    },
    {
      icon: EditIcon,
      onClick: (row) => handleOpenEditar(row),
      color: "default",
    },
  ];

  const searchActions = [
    {
      label: "Agregar Fraccionamiento",
      onClick: () => setOpenAgregar(true),
      color: "success",
      variant: "contained",
    },
  ];

  const filters = [
    {
      key: "estado",
      label: "Estado",
      value: statusFilter,
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
      ],
    },
  ];

  const activeFilters = [];
  if (statusFilter) {
    activeFilters.push({
      key: "estado",
      label: "Estado",
      value: statusFilter,
      color: statusFilter === "activo" ? "success" : "error",
    });
  }

  const handleFilterChange = (key, value) => {
    if (key === "estado") {
      setStatusFilter(value);
    }
  };

  const handleRemoveFilter = (key) => {
    if (key === "estado") {
      setStatusFilter("");
    }
  };

  const handleOpenEditar = (row) => {
    setSelectedRow(row);
    setOpenEditar(true);
  };

  const handleCloseEditar = () => {
    setOpenEditar(false);
    setSelectedRow(null);
  };

  const handleOpenContactoModal = (row) => {
    setSelectedContacto(row);
    setOpenContactoModal(true);
  };

  const handleCloseContactoModal = () => {
    setOpenContactoModal(false);
    setSelectedContacto(null);
  };

  const handleQrModal = (row) => {
    setQrData(row.qr);
    setOpenQrModal(true);
  };

  const handleCloseQrModal = () => setOpenQrModal(false);

  const handleDownloadQR = () => {
    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr_fraccionamiento.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <AdminHeader
        title="Panel Administrativo"
        subtitle="Gestión de fraccionamientos y usuarios"
        stats={stats}
      />

      <SearchAndActions
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Buscar fraccionamiento, usuario..."
        actions={searchActions}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        error={error}
        actions={actions}
        emptyMessage="No se encontraron fraccionamientos"
      />

      <AgregarFraccionamientoModal 
        open={openAgregar} 
        handleClose={() => setOpenAgregar(false)} 
        fetchData={fetchData} 
      />

      <EditarFraccionamientoModal
        open={openEditar}
        handleClose={handleCloseEditar}
        fraccionamiento={selectedRow}
        fetchData={fetchData}
      />

      <ContactoModal 
        open={openContactoModal} 
        handleClose={handleCloseContactoModal} 
        contacto={selectedContacto} 
      />

      <Dialog open={openQrModal} onClose={handleCloseQrModal}>
        <DialogTitle>QR del Fraccionamiento</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {qrData && <QRCodeSVG ref={qrRef} value={qrData} size={200} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadQR} color="primary">
            Descargar QR
          </Button>
          <Button onClick={handleCloseQrModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminTable;
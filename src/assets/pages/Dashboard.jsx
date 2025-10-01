import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  Typography,
  Box,
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
} from "@mui/material";
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import axios from "axios";

// Components
import Navbar from "../commponents/Navbar";
import AdminHeader from "../commponents/shared/AdminHeader";
import SearchAndActions from "../commponents/shared/SearchAndActions";
import HouseCard from "../commponents/shared/HouseCard";
import DashboardStats from "../commponents/shared/DashboardStats";
import EmptyState from "../commponents/shared/EmptyState";
import LoadingState from "../commponents/shared/LoadingState";

// Modals
import ResidentFormModal from "../commponents/modals/ResidentFormModal";
import EditResidentModal from "../commponents/modals/EditResidentModal";
import AddHouseModal from "../commponents/modals/AddHouseModal";
import QRModal from "../commponents/modals/QRModal";

const API_URL = process.env.REACT_APP_API_URL_PROD;


export default function DashboardFracc() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [openQR, setOpenQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openAddCasa, setOpenAddCasa] = useState(false);
  const [openEditResident, setOpenEditResident] = useState(false);
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [editingResident, setEditingResident] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });
  const [editFormData, setEditFormData] = useState({ nombre: "" });
  const [newCasa, setNewCasa] = useState({ numero: "" });

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const userId = user?._id;

  const navigate = useNavigate();

  const fetchData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      if (!user || !user.residencias) {
        if (showLoading) setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/api/fraccionamientos/${user._id}`);
      const casas = response.data.residencias || [];

      const dataFormatted = casas.map((casa, index) => ({
        id: index + 1,
        numero: casa.numero,
        activa: casa.activa, 
        residentes: casa.residentes.map((res) => ({
          _id: res._id,
          nombre: res.nombre,
          activo: res.activo,
        })),
      }));

      setData(dataFormatted);
      setFilteredData(dataFormatted);
    } catch (error) {
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCasaChange = (e) => {
    const { name, value } = e.target;
    setNewCasa((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (row) => {
    setSelectedCasa(row);
    setOpenForm(true);
  };

  const handleAddResidente = async () => {
    if (!formData.nombre) return;
    try {
      await axios.post(
        `${API_URL}/api/fraccionamientos/${user._id}/casas/${selectedCasa.numero}/residentes`,
        formData
      );
      setOpenForm(false);
      setFormData({ nombre: "" });
      fetchData();
    } catch (error) {
    }
  };

  const handleAddCasa = async () => {
    if (!newCasa.numero) return;
    try {
      await axios.post(`${API_URL}/api/fraccionamientos/${user._id}/casas`, newCasa);
      setNewCasa({ numero: "" });
      setOpenAddCasa(false);
      fetchData();
    } catch (error) {
    }
  };

  const toggleCasaActiva = async (numero) => {
    try {
      await axios.put(`${API_URL}/api/fraccionamientos/${user._id}/casas/${numero}/toggle`);
      fetchData();
    } catch (error) {
      console.error("Error al cambiar estado de la casa:", error);
    }
  };


  const handleDeleteResident = async (house, residente) => {
    try {
      await axios.delete(
        `${API_URL}/api/fraccionamientos/${user._id}/casas/${house.numero}/residentes/${residente._id}`
      );
      fetchData();
    } catch (error) {
      console.error("Error al eliminar residente:", error);
    }
  };

  const handleEditResident = (house, residente) => {
    setSelectedCasa(house);
    setEditingResident(residente);
    setEditFormData({
      nombre: residente.nombre
    });
    setOpenEditResident(true);
  };

  const handleUpdateResident = async () => {
    if (!editFormData.nombre || !editingResident) return;
    try {
      await axios.put(
        `${API_URL}/api/fraccionamientos/${user._id}/casas/${selectedCasa.numero}/residentes/${editingResident._id}`,
        editFormData
      );
      setOpenEditResident(false);
      setEditFormData({ nombre: "" });
      setEditingResident(null);
      fetchData();
    } catch (error) {
      console.error("Error al actualizar residente:", error);
    }
  };

  useEffect(() => {
    let filtered = data;
    
    if (searchValue) {
      filtered = filtered.filter((casa) => 
        casa.numero.toString().includes(searchValue) ||
        casa.residentes.some(res => 
          res.nombre.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter((casa) => {
        if (statusFilter === "activa") return casa.activa;
        if (statusFilter === "bloqueada") return !casa.activa;
        return true;
      });
    }
    
    setFilteredData(filtered);
  }, [data, searchValue, statusFilter]);


  const searchActions = [
    {
      label: "Agregar Casa",
      onClick: () => setOpenAddCasa(true),
      color: "success",
      variant: "contained",
      icon: AddIcon,
    },
    {
      label: "Ver Reportes",
      onClick: () => navigate(`/reportes/${userId}`),
      color: "primary",
      variant: "outlined",
    },
  ];

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleShowQR = (house) => {
    const fraccId = user._id;
    setQrValue(`https://admin-one-livid.vercel.app/Visitas?id=${fraccId}&casa=${house.numero}`);
    setOpenQR(true);
  };

  const handleAddResident = (house) => {
    setSelectedCasa(house);
    setOpenForm(true);
  };

  const filters = [
    {
      key: "estado",
      label: "Estado",
      value: statusFilter,
      options: [
        { value: "activa", label: "Activas" },
        { value: "bloqueada", label: "Bloqueadas" },
      ],
    },
  ];

  const activeFilters = [];
  if (statusFilter) {
    activeFilters.push({
      key: "estado",
      label: "Estado",
      value: statusFilter === "activa" ? "Activas" : "Bloqueadas",
      color: statusFilter === "activa" ? "success" : "error",
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

  const clearFilters = () => {
    setSearchValue("");
    setStatusFilter("");
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 3, pt: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard del Fraccionamiento
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Gestión de casas y residentes - {user?.fraccionamiento || 'Fraccionamiento'}
            </Typography>
          </Box>
          <LoadingState type="stats" />
          <LoadingState type="cards" count={8} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 3, pt: 2 }}>
        <AdminHeader
          title="Dashboard del Fraccionamiento"
          subtitle={`Gestión de casas y residentes - ${user?.fraccionamiento || 'Fraccionamiento'}`}
        />

        <DashboardStats data={data} />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
            <SearchAndActions
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              placeholder="Buscar casa o residente..."
              actions={searchActions}
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
            />
          </Box>
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{ 
              alignSelf: { xs: 'flex-end', md: 'center' },
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px !important',
                mx: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              }
            }}
          >
            <ToggleButton value="grid" sx={{ px: 2 }}>
              <GridViewIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" sx={{ px: 2 }}>
              <ListViewIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Fade in={!loading}>
          <Box>
            {filteredData.length === 0 ? (
              <EmptyState
                type={searchValue || statusFilter ? "no-results" : "no-data"}
                onAction={searchValue || statusFilter ? clearFilters : () => setOpenAddCasa(true)}
                actionLabel={searchValue || statusFilter ? "Limpiar Filtros" : "Agregar Primera Casa"}
              />
            ) : (
              <Grid container spacing={3}>
                {filteredData.map((house) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={viewMode === "grid" ? 6 : 12} 
                    md={viewMode === "grid" ? 4 : 12} 
                    lg={viewMode === "grid" ? 3 : 12}
                    key={house.id}
                  >
                    <HouseCard
                      house={house}
                      onAddResident={handleAddResident}
                      onToggleActive={toggleCasaActiva}
                      onShowQR={handleShowQR}
                      onDeleteResident={handleDeleteResident}
                      onEditResident={handleEditResident}
                      sx={{
                        height: viewMode === "list" ? "auto" : "100%",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Modals */}
        <QRModal
          open={openQR}
          onClose={() => setOpenQR(false)}
          qrValue={qrValue}
        />

        <ResidentFormModal
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setFormData({ nombre: "" });
          }}
          onSubmit={handleAddResidente}
          formData={formData}
          onInputChange={handleInputChange}
          selectedCasa={selectedCasa}
        />

        <AddHouseModal
          open={openAddCasa}
          onClose={() => {
            setOpenAddCasa(false);
            setNewCasa({ numero: "" });
          }}
          onSubmit={handleAddCasa}
          formData={newCasa}
          onInputChange={handleCasaChange}
        />

        <EditResidentModal
          open={openEditResident}
          onClose={() => {
            setOpenEditResident(false);
            setEditFormData({ nombre: "" });
            setEditingResident(null);
          }}
          onSubmit={handleUpdateResident}
          formData={editFormData}
          onInputChange={handleEditInputChange}
          selectedCasa={selectedCasa}
          editingResident={editingResident}
        />

      </Container>
    </Box>
  );
}

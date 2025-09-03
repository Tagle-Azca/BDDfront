import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  Container,
  Chip,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from "@mui/icons-material";
import axios from "axios";
import Navbar from "../commponents/Navbar";
import AdminHeader from "../commponents/shared/AdminHeader";
import SearchAndActions from "../commponents/shared/SearchAndActions";
import HouseCard from "../commponents/shared/HouseCard";
import DashboardStats from "../commponents/shared/DashboardStats";
import EmptyState from "../commponents/shared/EmptyState";
import LoadingState from "../commponents/shared/LoadingState";

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
  const [selectedCasa, setSelectedCasa] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", relacion: "" });
  const [newCasa, setNewCasa] = useState({ numero: "" });

  const isMobile = useMediaQuery("(max-width:600px)");

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const userId = user?._id;

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user || !user.residencias) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/api/fraccionamientos/${user._id}`);
      const casas = response.data.residencias || [];

      const dataFormatted = casas.map((casa, index) => ({
        id: index + 1,
        numero: casa.numero,
        activa: casa.activa, 
        residentes: casa.residentes.map((res) => ({
          nombre: res.nombre,
          relacion: res.relacion,
        })),
      }));

      setData(dataFormatted);
      setFilteredData(dataFormatted);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.nombre || !formData.relacion) return;
    try {
      await axios.post(
        `${API_URL}/api/fraccionamientos/${user._id}/casas/${selectedCasa.numero}/residentes`,
        formData
      );
      setOpenForm(false);
      setFormData({ nombre: "", relacion: "" });
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

  const handleToggleResidentActive = async (house, residente) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/fraccionamientos/${user._id}/casas/${house.numero}/residentes/${residente._id}/toggle`
      );
      fetchData();
    } catch (error) {
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
    setQrValue(`${fraccId}&casa=${house.numero}`);
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
                      onToggleResidentActive={handleToggleResidentActive}
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

          <Dialog 
            open={openQR} 
            onClose={() => setOpenQR(false)} 
            fullScreen={isMobile}
            maxWidth="sm"
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                overflow: 'hidden'
              }
            }}
          >
            <DialogTitle sx={{ 
              fontSize: 20, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0ba969 0%, #0a8d5d 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <QrCodeIcon />
              Código QR de Registro
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", py: 4 }}>
              <Box sx={{ 
                p: 3, 
                bgcolor: "#ffffff", 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '2px solid #f0f0f0',
                mx: 'auto',
                maxWidth: 280
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    qrValue
                  )}`}
                  alt="QR Code"
                  style={{ 
                    display: "block", 
                    margin: "0 auto",
                    border: "4px solid #f8f9fa",
                    borderRadius: "8px"
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
              <Button 
                onClick={() => setOpenQR(false)} 
                variant="contained" 
                size="medium"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  background: 'linear-gradient(135deg, #0ba969 0%, #0a8d5d 100%)'
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openForm} 
            onClose={() => setOpenForm(false)} 
            fullScreen={isMobile}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                minHeight: isMobile ? '100vh' : 'auto',
              }
            }}
          >
            <DialogTitle sx={{ 
              fontSize: 20, 
              fontWeight: 600,
              pb: 1,
              background: 'linear-gradient(135deg, #0ba969 0%, #0a8d5d 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <PersonAddIcon />
              Agregar Nuevo Residente
              {selectedCasa && (
                <Chip 
                  label={`Casa ${selectedCasa.numero}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    ml: 'auto'
                  }}
                />
              )}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <TextField 
                  label="Nombre completo" 
                  name="nombre" 
                  value={formData.nombre}
                  onChange={handleInputChange} 
                  fullWidth 
                  variant="outlined"
                  placeholder="Ingrese el nombre completo"
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                  required
                />
                <TextField 
                  label="Relación con la propiedad" 
                  name="relacion" 
                  value={formData.relacion}
                  onChange={handleInputChange} 
                  fullWidth 
                  variant="outlined"
                  placeholder="Ej: Propietario, Familiar, Inquilino, Empleado..."
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                  helperText="Especifique la relación del residente con la propiedad"
                />
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: 2,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Información:</strong> El residente será agregado a la casa {selectedCasa?.numero} y podrá registrar visitas usando el código QR correspondiente.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button 
                onClick={() => {
                  setOpenForm(false);
                  setFormData({ nombre: "", relacion: "" });
                }} 
                variant="outlined"
                size="medium"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddResidente} 
                variant="contained"
                size="medium"
                disabled={!formData.nombre.trim()}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                  }
                }}
              >
                Agregar Residente
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openAddCasa} 
            onClose={() => setOpenAddCasa(false)} 
            fullScreen={isMobile}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: isMobile ? 0 : 3,
                minHeight: isMobile ? '100vh' : 'auto',
              }
            }}
          >
            <DialogTitle sx={{ 
              fontSize: 20, 
              fontWeight: 600,
              pb: 1,
              background: 'linear-gradient(135deg, #0ba969 0%, #0a8d5d 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <AddIcon />
              Agregar Nueva Casa
            </DialogTitle>
           
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Complete la información de la nueva casa
                  </Typography>
                </Box>
                <TextField 
                  label="Número de Casa" 
                  name="numero" 
                  value={newCasa.numero}
                  onChange={handleCasaChange} 
                  fullWidth 
                  variant="outlined"
                  placeholder="Ej: 101, A-5, etc."
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                  required
                />
               
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button 
                onClick={() => {
                  setOpenAddCasa(false);
                  setNewCasa({ numero: "" });
                }} 
                variant="outlined"
                size="medium"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCasa} 
                variant="contained"
                size="medium"
                disabled={!newCasa.numero.trim()}
                sx={{ 
                  color: 'white', 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                  }
                }}
              >
                Agregar Casa
              </Button>
            </DialogActions>
          </Dialog>

      </Container>
    </Box>
  );
}

import React from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const FilterChip = ({ label, value, onDelete, color = "default" }) => (
  <Chip
    label={`${label}: ${value}`}
    onDelete={onDelete}
    color={color}
    variant="outlined"
    size="small"
  />
);

const SearchAndActions = ({
  searchValue = "",
  onSearchChange = () => {},
  placeholder = "Buscar...",
  actions = [],
  filters = [],
  activeFilters = [],
  onFilterChange = () => {},
  onRemoveFilter = () => {},
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: "flex", 
        gap: 2, 
        alignItems: "center",
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        mb: 2
      }}>
        <TextField
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ 
            minWidth: 300,
            flexGrow: 1,
          }}
        />
        
        {filters.map((filter) => (
          <FormControl key={filter.key} sx={{ minWidth: 120 }}>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={filter.value || ""}
              label={filter.label}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
              onClick={action.onClick}
              startIcon={action.icon ? <action.icon /> : <AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      {activeFilters.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Filtros activos:</span>
          {activeFilters.map((filter, index) => (
            <FilterChip
              key={index}
              label={filter.label}
              value={filter.value}
              color={filter.color}
              onDelete={() => onRemoveFilter(filter.key)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchAndActions;
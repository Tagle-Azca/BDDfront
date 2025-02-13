import React, { useState, useEffect } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select, CircularProgress } from "@mui/material";
import axios from "axios";

const DynamicSelect = ({ apiUrl, label, valueField, displayField, onChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={selectedValue} onChange={handleChange} label={label}>
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            data.map((item) => (
              <MenuItem key={item[valueField]} value={item[valueField]}>
                {item[displayField]}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DynamicSelect;
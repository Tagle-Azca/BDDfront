import React, { useState, useEffect } from "react";
import { Paper, Box, CircularProgress, TextField, Button } from "@mui/material";
import { useResidences } from "./hooks/useResidences.js";
import ResidenceTableView from "./components/ResidenceTableView";
import AddResidentDialog from "./components/AddResidentDialog.jsx";
import TableHeader from "./components/TableHeader";

const ResidenceTable = () => {
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { residences, loading, addResident } = useResidences();

  const filteredRows = residences.filter(
    (row) =>
      row.direccion.toLowerCase().includes(search.toLowerCase()) ||
      row.fraccionamiento.toLowerCase().includes(search.toLowerCase()) ||
      row.residentes.some((residente) =>
        residente.nombre.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handleOpenForm = (row = null) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleAddResident = async (formData) => {
    if (selectedRow) {
      await addResident(selectedRow._id, formData);
    }
    handleCloseForm();
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
        <TableHeader 
          onAddNew={() => handleOpenForm()}
          search={search}
          onSearchChange={setSearch}
        />
        <ResidenceTableView 
          rows={filteredRows}
          onAddResident={handleOpenForm}
        />
      </Paper>

      <AddResidentDialog
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleAddResident}
        selectedRow={selectedRow}
      />
    </>
  );
};

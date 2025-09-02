import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  Checkbox,
} from "@mui/material";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRowClick = null,
  actions = [],
  selectable = false,
  onSelectionChange = null,
  emptyMessage = "No hay datos disponibles",
  initialRowsPerPage = 10,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row._id || row.id);
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter((selectedId) => selectedId !== id);
    }

    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  if (loading) {
    return (
      <Paper sx={{ width: "100%", p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: "100%", p: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );
  }

  if (data.length === 0) {
    return (
      <Paper sx={{ width: "100%", p: 4, textAlign: "center" }}>
        <Typography color="textSecondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.id} style={{ fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const rowId = row._id || row.id;
              const isRowSelected = isSelected(rowId);

              return (
                <TableRow
                  hover
                  key={rowId}
                  selected={isRowSelected}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isRowSelected}
                        onChange={() => handleSelectRow(rowId)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render ? column.render(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {actions.map((action, index) => (
                          <IconButton
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            color={action.color || "default"}
                            size="small"
                          >
                            <action.icon />
                          </IconButton>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

export default DataTable;
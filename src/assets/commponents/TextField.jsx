import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      margin="dense"
      variant="outlined"
      type={type}
    />
  );
};

export default InputField;
import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      variant="outlined"
      margin="normal"
    />
  );
};

export default InputField;

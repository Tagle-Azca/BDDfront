import React, { useState } from "react";
import InputField from "../commponents/TextField";
import SubmitButton from "../commponents/subButton";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    edad: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Datos enviados: \nNombre: ${formData.nombre}\nEmail: ${formData.email}\nEdad: ${formData.edad}`
    );
  };

  return (
    <div>
      <h1>Formulario de Registro</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Nombre:"
          value={formData.nombre}
          onChange={handleChange}
          type="text"
        />
        <InputField
          label="Email:"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <InputField
          label="Edad:"
          value={formData.edad}
          onChange={handleChange}
          type="number"
        />
        <SubmitButton text="Enviar" />
      </form>
    </div>
  );
};

export default Formulario;

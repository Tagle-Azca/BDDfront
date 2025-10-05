import react from "react";


const [FotoVisita, setFotoVisita] = react.useState(null);

const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFotoError(true);
        setErrorGeneral("Solo se permiten imágenes JPG o PNG");
        return;
      }
      setFotoVisita(file);
      setFotoError(false);
      setErrorGeneral("");
    }
  };

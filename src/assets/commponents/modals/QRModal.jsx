import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";

const QRModal = ({
  open,
  onClose,
  qrValue,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
          onClick={onClose} 
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
  );
};

export default QRModal;
import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    const qr = await QRCode.toDataURL(text);
    return qr;
  } catch (error) {
    console.error("Error generando el código QR", error);
  }
};

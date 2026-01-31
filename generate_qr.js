const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Mock Merchant Data
const merchantData = {
  merchantId: "merchant-123456",
  name: "Spartan Coffee Co.",
  location: "East Lansing, MI",
  imageUrl: "https://example.com/logo.png"
};

const dataString = JSON.stringify(merchantData);
const outputPath = path.join(__dirname, 'merchant_qr.png');

QRCode.toFile(outputPath, dataString, {
  color: {
    dark: '#000000',  // Blue dots
    light: '#0000' // Transparent background
  }
}, function (err) {
  if (err) throw err;
  console.log('QR code generated at ' + outputPath);
  console.log('Data encoded:', dataString);
});

const fs = require('fs');
const QRCode = require('qrcode');

// Mock Merchant Data matching mockDb.ts
const merchantData = {
    id: "5bf37c93-2c6d-497a-95d5-a8cdcc9bdb24",
    name: "Spartan Coffee"
};

const outputDir = './test_qrs';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Generate Earn QR
QRCode.toFile(
    `${outputDir}/earn_spartan_coffee.png`,
    JSON.stringify(merchantData),
    {
        color: {
            dark: '#8B4513',  // Brown dots
            light: '#ffffff'
        },
        width: 300
    },
    function (err) {
        if (err) throw err;
        console.log('✅ Generated test QR code: test_qrs/earn_spartan_coffee.png');
    }
);

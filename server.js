const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Render akan otomatis mengisi PORT ini

app.use(express.json());

let antreanDonasi = null;

// Endpoint untuk menerima donasi dari Saweria
app.post('/saweria-webhook', (req, res) => {
    console.log("Ada donasi masuk dari Saweria!");
    const data = req.body;
    
    if (data && data.data) {
        antreanDonasi = {
            donator: data.data.customer_name,
            jumlah: data.data.amount
        };
    }
    res.status(200).send('OK');
});

// Endpoint untuk Roblox mengambil data donasi
app.get('/get-donasi', (req, res) => {
    if (antreanDonasi) {
        res.json(antreanDonasi);
        antreanDonasi = null; // Hapus setelah diambil agar tidak memicu efek berulang kali
    } else {
        res.json({});
    }
});

app.listen(PORT, () => {
    console.log(`Server online berjalan di port ${PORT}`);
});

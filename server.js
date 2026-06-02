const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000; // Mengikuti port otomatis dari Railway

app.use(bodyParser.json());

// Menggunakan sistem Array (Antrean) agar data donasi tidak gampang hilang/terhapus sebelum diambil Roblox
let antreanDonasi = [];

app.get('/', (req, res) => {
    res.send("Server Jembatan Saweria-Roblox Aktif 24/7 di Cloud!");
});

// ==========================================
// 1. JALUR UNTUK MENERIMA DATA DARI SAWERIA (POST)
// ==========================================
app.post('/saweria-webhook', (req, res) => {
    const data = req.body;
    
    if (!data) {
        return res.status(400).send("Data kosong");
    }

    // Ambil data dengan proteksi (Sanggup membaca Donasi Asli maupun Tombol Tes Saweria)
    const namaDonatur = data.donator_name || data.donator || "Anonim";
    const pesanDonasi = data.message || data.pesan || "";
    
    // Memastikan jumlah uang diubah menjadi angka bersih murni (mengatasi string dari tombol tes)
    let jumlahRaw = data.amount_raw || data.amount || data.jumlah || 0;
    const jumlahUang = parseInt(String(jumlahRaw).replace(/[^0-9]/g, '')) || 0;
    
    const donasiBaru = {
        donator: namaDonatur,
        jumlah: jumlahUang,
        pesan: pesanDonasi,
        timestamp: Date.now()
    };
    
    // Masukkan ke dalam antrean
    antreanDonasi.push(donasiBaru);
    
    console.log(`\n🎉 DATA MASUK KE RAILWAY! 🎉`);
    console.log(`Dari: ${donasiBaru.donator}`);
    console.log(`Jumlah: Rp ${donasiBaru.jumlah}`);
    console.log(`Pesan: "${donasiBaru.pesan}"`);
    
    res.status(200).send("OK");
});

// ==========================================
// 2. JALUR UNTUK ROBLOX MENGAMBIL DATA (GET)
// ==========================================
app.get('/get-donasi', (req, res) => {
    if (antreanDonasi.length > 0) {
        // Ambil donasi pertama yang ada di antrean
        const donasiYangDiambil = antreanDonasi.shift(); 
        
        // Kirim ke Roblox
        res.json(donasiYangDiambil);
    } else {
        // Jika kosong, kirim pesan sepi yang aman
        res.json({ message: "Tidak ada donasi baru", sepi: true });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Server Cloud Saweria-Roblox AKTIF!`);
    console.log(`Berjalan di Port: ${PORT}`);
    console.log(`==================================================`);
});
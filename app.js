const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Menyajikan semua file di dalam folder 'public' (termasuk index.html kamu)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    // MENANGKAP INPUT: req.query mengambil parameter dari alamat URL
    const kota = req.query.namakota;
    
    // API Key diperbaiki ke versi yang benar
    const apikey = "UtOPADI1VEiBs7Pa0aCG";

    // Mencegah error kalau kotak pencariannya kosong
    if (!kota) {
        return res.status(400).json({ message: "Nama kota belum dimasukkan" });
    }

    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apikey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Cek jika datanya ada
        if (data.features && data.features.length > 0) {
            const fiturUtama = data.features[0];
            const longitude = fiturUtama.geometry.coordinates[0];
            const latitude = fiturUtama.geometry.coordinates[1];
            const namaKota = fiturUtama.text;

            let namaNegara = "-";
            let namaProvinsi = "-";
            let namaKecamatan = "-";

            // Mengurai negara, provinsi, dan kecamatan dari dalam 'context'
            if (fiturUtama.context) {
                fiturUtama.context.forEach(item => {
                    if (item.id.includes("country")) namaNegara = item.text;
                    if (item.id.includes("region") || item.id.includes("province")) namaProvinsi = item.text;
                    if (item.id.includes("place") || item.id.includes("municipality") || item.id.includes("district")) namaKecamatan = item.text;
                });
            }

            // Jika fitur utamanya sendiri adalah region/provinsi, set provinsi = namaKota
            if (fiturUtama.id && fiturUtama.id.includes("region")) {
                namaProvinsi = namaKota;
            }

            // Jika fitur utamanya adalah place/kota, set kecamatan = namaKota
            if (fiturUtama.id && fiturUtama.id.includes("place")) {
                namaKecamatan = namaKota;
            }

            // MENGIRIM JAWABAN: Memberikan data rapi ke HTML
            res.json({ 
                kota: namaKota,
                negara: namaNegara,
                provinsi: namaProvinsi,
                kecamatan: namaKecamatan,
                lon: longitude,
                lat: latitude
            });
        } else {
            res.status(404).json({ message: "Lokasi tidak ditemukan" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Gagal mengambil data dari MapTiler' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
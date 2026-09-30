const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname,"public")));

app.get("/api/lokasi", async(requestAnimationFrame,res) => {
    const kota = "jakarta";

    const apikey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/gecoding/${kota}.json?key=${apikey}`;

    try{
        const response = await axios.get(url);
        console.log(response.data);

        const data = response.data;

        const lokasi = data.features[0].matching_text;
        const kordinat = data.features[0].geometry.coordinate;

        res.json({
            kota: lokasi,
            koordinat: kordinat
        });
        
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal ngambil data wak dari MapTiler"
        });
    }
});

app.listen(PORT, () => {

console.log(`server berjalan di http://localhost:${port}`)

});
const asyncRequest = require('async-request');


const getWeather = async (location) => {
    const access_key = "440594621a25bf5a1aae263faaf9d05e";
    const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${location}`;

    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        const weather = {
            isSuccess: true,
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            wind_speed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover,
        };
        console.log(weather);
        return weather;
    } catch (error) {
        console.log(error);
        return {
            isSuccess: false,
            error,
        };
    }
};

const express = require('express');
const app = express();
const path = require('path');
// __dirname là đường dẫn tuyệt đối chạy thẳng tới ngay url đang code là app.js
// từ file app.js kết hợp với public
const pathPublic = path.join(__dirname, "./public");
app.use(express.static(pathPublic));

// http://localhost:7000/ 
app.get("/", async (req, res) => {
    const params = req.query;
    const location = params.address;
    const weather = await getWeather(location);

    if (location) {
        res.render('weather', {
            status: true,
            region: weather.region,
            country: weather.country,
            temperature: weather.temperature,
            wind_speed: weather.wind_speed,
            precip: weather.precip,
            cloudcover: weather.cloudcover
        });
    } else {
        res.render('weather', {
            status: false,
        });
    }
});

app.set("view engine", "hbs"); // pug

const port = 7000;
app.listen(port, () => {
    console.log(`app run on http://localhost:${port}/ `);
});

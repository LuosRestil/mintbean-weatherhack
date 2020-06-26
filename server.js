const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/api/getLocByAddress", (req, res) => {
  let address = req.query.address;
//   add validation
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBRZqOJHSNU7gKUpVY5ConeJrkbx5pqDJQ`)
  .then(response => {
    console.log(response);
    return response.json()})
  .then(json => {
    console.log(json);
    location = {latitude: json.results[0].geometry.location.lat, longitude: json.results[0].geometry.location.lng};
    console.log(location);
    res.send(location);
  })
})

app.get("/api/getLocByIP", (req, res) => {
  let ip = req.query.ip;
  fetch(`http://api.ipstack.com/${ip}?access_key=${process.env.IP_API_KEY}`)
  .then(response => response.json())
  .then(json => {
    res.send(json);
  })
})

app.get("/api/getWeather", (req, res) => {
  let latitude = req.query.lat;
  let longitude = req.query.long;
  let units = req.query.units;
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}`)
  .then(response => response.json())
  .then(json => {
    res.send(json);
  })
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
let icons = {
  "01d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconClearDay.svg?v=1593135762100",
  "01n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconClearNight.svg?v=1593135766659",
  "02d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconFewCloudsDay.svg?v=1593135776512",
  "02n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconFewCloudsNight.svg?v=1593135783280",
  "03d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconCloud.svg?v=1593190970464",
  "03n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconCloud.svg?v=1593190970464",
  "04d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconCloud.svg?v=1593190970464",
  "04n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconCloud.svg?v=1593190970464",
  "09d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconShowerDay.svg?v=1593135803168",
  "09n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconShowerNight.svg?v=1593135809770",
  "10d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconRain.svg?v=1593135797432",
  "10n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconRain.svg?v=1593135797432",
  "11d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconThunderstorm2.svg?v=1593136144189",
  "11n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconThunderstorm2.svg?v=1593136144189",
  "13d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconSnow.svg?v=1593135814985",
  "13n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconSnow.svg?v=1593135814985",
  "50d":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconMist.svg?v=1593135790892",
  "50n":
    "https://cdn.glitch.com/b8849fbe-4a61-4a9f-bde7-7ed7b60bc81a%2FiconMist.svg?v=1593135790892"
};

let geolocationEnabled;
let latitude;
let longitude;
let loc;
let units;
let night = false;
if (localStorage.getItem("units")) {
  units = localStorage.getItem("units");
} else {
  units = "imperial";
}

function getUserLocation() {
  if (units == "imperial") {
    fahrenheit();
  } else {
    celsius();
  }
  fetch("https://api.ipify.org/?format=json")
    .then(response => response.json())
    .then(json => {
      let ip = json.ip;
      fetch(`../api/getLocByIP?ip=${ip}`)
        .then(response => response.json())
        .then(json => {
          loc = `${json.city}, ${json.region_name}, ${json.country_name}`;
          latitude = json.latitude;
          longitude = json.longitude;
          getWeather(latitude, longitude, units, loc);
        });
    });
}

function fahrenheit() {
  units = "imperial";
  document.querySelectorAll(".units-button").forEach(item => {
    item.classList.remove("selected");
  });
  document.getElementById("fahrenheit").classList.add("selected");
  localStorage.setItem("units", "imperial");
  if (latitude && longitude) {
    getWeather(latitude, longitude, units, loc);
  }
}

function celsius() {
  units = "metric";
  document.querySelectorAll(".units-button").forEach(item => {
    item.classList.remove("selected");
  });
  document.getElementById("celsius").classList.add("selected");
  localStorage.setItem("units", "metric");
  if (latitude && longitude) {
    getWeather(latitude, longitude, units, loc);
  }
}

function getWeather(latitude, longitude, units, loc) {
  fetch(`../api/getWeather?lat=${latitude}&long=${longitude}&units=${units}`)
    .then(response => response.json())
    .then(json => {
      let currentdt = new Date(json.current.dt * 1000);
      let currentSunset = new Date(json.current.sunset * 1000);
      let currentSunrise = new Date(json.current.sunrise * 1000);
      if (currentdt > currentSunset || currentdt < currentSunrise) {
        night = true;
      } else {
        night = false;
      }
      if (night) {
        document.querySelector("body").classList.add("night");
        document.querySelector("body").classList.remove("day");
      } else {
        document.querySelector("body").classList.add("day");
        document.querySelector("body").classList.remove("night");
      }
      let currentTemp = Math.round(json.current.temp);
      let todayLow = Math.round(json.daily[0].temp.min);
      let todayHigh = Math.round(json.daily[0].temp.max);
      let currentWeatherMain = json.current.weather[0].main;
      let currentWeatherDescription = json.current.weather[0].description;
      if (currentWeatherDescription == "Heavy intensity rain") {
        currentWeatherDescription = "Heavy rain";
      }
      let currentWeatherIcon = icons[json.current.weather[0].icon];
      console.log(currentWeatherIcon)
      let currentWeather = document.getElementById("current-weather-wrapper");
      let forecast = document.getElementById("forecast-wrapper");
    
      // update current weather
      currentWeather.innerHTML = `<h1 class="text-4xl font-semibold">${
        loc.split(",")[0]
      }</h1><p class="text-5xl">${currentTemp}°</p><img src=${currentWeatherIcon} alt="Current weather icon" class="today-icon"/><p class="text-3xl">${currentWeatherDescription[0].toUpperCase() +
        currentWeatherDescription.slice(
          1
        )}</p><p class="mt-2 text-2xl mb-10">Low: ${todayLow}°, High: ${todayHigh}°</p>`;
    
      // update forecast
      forecast.innerHTML = "";
      for (let day of json.daily.slice(1)) {
        let date = new Date(day.dt * 1000).toDateString().split(" ")[0] + ".";
        let icon = icons[day.weather[0].icon];
        let description = day.weather[0].description[0].toUpperCase() +
            day.weather[0].description.slice(1);
        if (description == "Heavy intensity rain") {
          description = "Heavy rain";
        }
        forecast.insertAdjacentHTML(
          "beforeend",
          `<div class="mb-2 md:text-xl"><div class="flex flex-row px-3 items-center"><p class="mr-1 w-12 text-left">${date}</p><img src=${icon} alt="Day's weather icon" class="h-10 mr-2"/><p class="mr-2">${description}</p><p>${Math.round(
            day.temp.min
          )}°/${Math.round(day.temp.max)}°</p></div></div>`
        );
      }
    
    });
}

document.getElementById("city-selector").addEventListener("submit", e => {
  e.preventDefault();
  let searchValue = e.target[0].value;
  let searchValueMod = searchValue.replace(" ", "+");
  fetch(`../api/getLocByAddress?address=${searchValueMod}`)
    .then(response => response.json())
    .then(json => {
      latitude = json.latitude;
      longitude = json.longitude;
      loc = searchValue;
      getWeather(latitude, longitude, units, searchValue);
    });
});

// INITIAL PAGE LOAD...
getUserLocation();

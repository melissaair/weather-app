function formatDate(date) {
  let currentHour = date.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[dayIndex];
  return `${currentDay} ${currentHour}:${currentMinutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

function displayForecast(response) {
  let forecast = (response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(forecastDay, index) {
    if (index < 6) {
      forecastHTML = forecastHTML + 
      `
      <div class="col">
        <p class="day">${formatDay(forecastDay.dt)}</p>
        <img 
          src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" 
          width="42"
        />
        <p class="dayTemp"><span class="forecast-max">${Math.round(forecastDay.temp.max)}° | </span><span class="forecast-min">${Math.round(forecastDay.temp.min)}°</span></p>
      </div>`;
    }
    
  });

  forecastElement.innerHTML = forecastHTML;
}



let li = document.querySelector("#date");
let now = new Date();

li.innerHTML = formatDate(now);

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "7677ab34c9ac366d0f3ee07e10dd24d2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#currentTemp");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let descriptionElement = document.querySelector("#description");
  let feelsElement = document.querySelector("#feels-like");
  let highElement = document.querySelector("#high");
  let lowElement = document.querySelector("#low");
  let iconElement = document.querySelector("#icon");

  fahrenheitTemp = Math.round(response.data.main.temp);

  currentTemp.innerHTML = `${fahrenheitTemp}`;
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.weather[0].description;
  feelsElement.innerHTML = Math.round(response.data.main.feels_like);
  highElement.innerHTML = Math.round(response.data.main.temp_max);
  lowElement.innerHTML = Math.round(response.data.main.temp_min);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "7677ab34c9ac366d0f3ee07e10dd24d2";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "imperial";
  let apiKey = "7677ab34c9ac366d0f3ee07e10dd24d2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let celsiusTemp = ((fahrenheitTemp - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#currentTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#currentTemp");
  temperatureElement.innerHTML = fahrenheitTemp;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitTemp = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

searchCity("Los Angeles");

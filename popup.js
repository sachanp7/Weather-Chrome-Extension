const API_KEY = "";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const weatherIconsMap = {
  "01d": "wi-day-sunny",
  "01n": "wi-night-clear",
  "02d": "wi-day-cloudy",
  "02n": "wi-night-alt-cloudy",
  "03d": "wi-cloud",
  "03n": "wi-cloud",
  "04d": "wi-cloudy",
  "04n": "wi-cloudy",
  "09d": "wi-showers",
  "09n": "wi-showers",
  "10d": "wi-day-rain",
  "10n": "wi-night-alt-rain",
  "11d": "wi-thunderstorm",
  "11n": "wi-thunderstorm",
  "13d": "wi-snow",
  "13n": "wi-snow",
  "50d": "wi-fog",
  "50n": "wi-fog"
};

function updateDateTime() {
  const now = new Date();
  document.getElementById("date_time").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
}

function displayWeather(data) {
  document.getElementById("location").textContent = data.name;
  document.getElementById("condition_des").textContent =
    data.weather[0].description;

  document.getElementById("temp").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("feels_like").textContent =
    `${Math.round(data.main.feels_like)}°C`;

  document.getElementById("max_temp").textContent =
    `${Math.round(data.main.temp_max)}°C`;

  document.getElementById("min_temp").textContent =
    `${Math.round(data.main.temp_min)}°C`;

  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `${data.wind.speed} m/s`;

  document.getElementById("visibility").textContent =
    `${(data.visibility / 1000).toFixed(1)} km`;

  const iconCode = data.weather[0].icon;
  const iconClass = weatherIconsMap[iconCode] || "wi-day-sunny";
  document.getElementById("icon").innerHTML =
    `<i class="wi ${iconClass}"></i>`;
}

async function fetchWeatherByCity(city) {
  try {
    const res = await fetch(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    alert(err.message);
  }
}

async function fetchWeatherByLocation(lat, lon) {
  const res = await fetch(
    `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();
  displayWeather(data);
}

/* Search city */
document.getElementById("searchCity").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    fetchWeatherByCity(e.target.value);
  }
});

/* Auto-detect location on load */
navigator.geolocation.getCurrentPosition(
  pos => {
    fetchWeatherByLocation(
      pos.coords.latitude,
      pos.coords.longitude
    );
  },
  () => {
    fetchWeatherByCity("New York");
  }
);

updateDateTime();
setInterval(updateDateTime, 60000);

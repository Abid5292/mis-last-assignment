const searchForm = document.getElementById("searchForm");
const countryInput = document.getElementById("countryInput");
const countryDetails = document.getElementById("countryDetails");
const weatherDetails = document.getElementById("weatherDetails");
const moreBtn = document.getElementById("moreBtn");

const weatherApiKey = "2013e40a9ea34364876194522242512";

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const countryName = countryInput.value.trim();

  if (!countryName) return alert("Please enter a country name!");

  try {
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryResponse.json();
    if (countryData.status === 404) throw new Error("Country not found!");

    const country = countryData[0];
    displayCountryDetails(country);
    moreBtn.onclick = () => fetchWeather(country.capital[0], country.name.common);
  } catch (error) {
    alert(error.message);
  }
});

function displayCountryDetails(country) {
  countryDetails.innerHTML = `
    <h3 class="text-center">Country Details</h3>
    <p><strong>Official Name:</strong> ${country.name.official}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</p>
    <p><strong>Currency:</strong> ${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="img-fluid">
  `;
  countryDetails.classList.remove("d-none");
  moreBtn.classList.remove("d-none");
}

async function fetchWeather(city, countryName) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
    );
    const weatherData = await weatherResponse.json();
    if (weatherData.cod !== 200) throw new Error("Weather data not found!");

    displayWeatherDetails(weatherData, countryName);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeatherDetails(weatherData, countryName) {
  weatherDetails.innerHTML = `
    <h3 class="text-center">Weather Information</h3>
    <p><strong>City:</strong> ${weatherData.name}</p>
    <p><strong>Country:</strong> ${countryName}</p>
    <p><strong>Current Temperature:</strong> ${weatherData.main.temp}°C</p>
    <p><strong>Feels Like:</strong> ${weatherData.main.feels_like}°C</p>
    <p><strong>Weather Condition:</strong> ${weatherData.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} km/h</p>
    <p><strong>Wind Direction:</strong> ${weatherData.wind.deg}°</p>
  `;
  weatherDetails.classList.remove("d-none");
}

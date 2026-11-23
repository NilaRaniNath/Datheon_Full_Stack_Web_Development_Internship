/**
 * AuraCast — Real-Time Weather Forecast & Climate Telemetry
 * Pure Vanilla JavaScript (ES6+ fetch, async/await, try-catch, and Array.map())
 * Third-Party REST API Integration: OpenWeatherMap API
 */

'use strict';

/* ============================================================
   API Configuration
   Replace the placeholder below with your OpenWeatherMap API Key
   Register free at: https://home.openweathermap.org/users/sign_up
   ============================================================ */
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_CITY = "Sylhet";

/* ============================================================
   Application State
   ============================================================ */
let currentUnit = "metric"; // 'metric' (°C, m/s) | 'imperial' (°F, mph)
let currentCity = DEFAULT_CITY;
let cachedWeatherData = null;
let cachedForecastData = null;

/* ============================================================
   Fallback Mock Telemetry Data (Used when API_KEY is placeholder
   or if network/rate-limit blocks external access)
   ============================================================ */
const MOCK_DATA = {
  Sylhet: {
    coord: { lat: 24.8949, lon: 91.8687 },
    name: "Sylhet",
    sys: { country: "BD", sunrise: 1763856000, sunset: 1763895600 },
    dt: Math.floor(Date.now() / 1000),
    timezone: 21600,
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    main: { temp: 24.2, feels_like: 25.1, temp_min: 19.5, temp_max: 27.8, pressure: 1013, humidity: 68 },
    visibility: 10000,
    wind: { speed: 3.4, deg: 45 },
  },
  Dhaka: {
    coord: { lat: 23.8103, lon: 90.4125 },
    name: "Dhaka",
    sys: { country: "BD", sunrise: 1763856200, sunset: 1763895800 },
    dt: Math.floor(Date.now() / 1000),
    timezone: 21600,
    weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
    main: { temp: 27.5, feels_like: 29.2, temp_min: 22.0, temp_max: 30.5, pressure: 1011, humidity: 62 },
    visibility: 8000,
    wind: { speed: 4.1, deg: 120 },
  },
  London: {
    coord: { lat: 51.5074, lon: -0.1278 },
    name: "London",
    sys: { country: "GB", sunrise: 1763882400, sunset: 1763914800 },
    dt: Math.floor(Date.now() / 1000),
    timezone: 0,
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10d" }],
    main: { temp: 11.4, feels_like: 10.2, temp_min: 8.5, temp_max: 13.0, pressure: 1008, humidity: 82 },
    visibility: 9000,
    wind: { speed: 5.8, deg: 210 },
  },
  Tokyo: {
    coord: { lat: 35.6762, lon: 139.6503 },
    name: "Tokyo",
    sys: { country: "JP", sunrise: 1763847600, sunset: 1763883600 },
    dt: Math.floor(Date.now() / 1000),
    timezone: 32400,
    weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    main: { temp: 16.8, feels_like: 15.9, temp_min: 13.0, temp_max: 18.5, pressure: 1020, humidity: 55 },
    visibility: 10000,
    wind: { speed: 3.2, deg: 340 },
  },
  "New York": {
    coord: { lat: 40.7128, lon: -74.0060 },
    name: "New York",
    sys: { country: "US", sunrise: 1763899200, sunset: 1763935200 },
    dt: Math.floor(Date.now() / 1000),
    timezone: -18000,
    weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
    main: { temp: 14.2, feels_like: 13.1, temp_min: 9.0, temp_max: 16.5, pressure: 1018, humidity: 48 },
    visibility: 10000,
    wind: { speed: 4.6, deg: 280 },
  },
};

/* ============================================================
   DOM Element Selectors
   ============================================================ */
const elements = {
  // Unit Toggles
  unitCBtn: document.getElementById("unit-c-btn"),
  unitFBtn: document.getElementById("unit-f-btn"),

  // Search
  searchForm: document.getElementById("search-form"),
  cityInput: document.getElementById("city-input"),
  clearSearchBtn: document.getElementById("clear-search-btn"),
  chipButtons: document.querySelectorAll(".chip-btn"),

  // State Containers
  errorBanner: document.getElementById("error-banner"),
  errorTitle: document.getElementById("error-title"),
  errorMessage: document.getElementById("error-message"),
  dismissErrorBtn: document.getElementById("dismiss-error-btn"),
  loadingState: document.getElementById("loading-state"),
  weatherDisplay: document.getElementById("weather-display"),
  fallbackState: document.getElementById("fallback-state"),

  // Current Telemetry Hero
  telemetryCity: document.getElementById("telemetry-city"),
  telemetryTime: document.getElementById("telemetry-time"),
  telemetryConditionText: document.getElementById("telemetry-condition-text"),
  telemetryTemp: document.getElementById("telemetry-temp"),
  telemetryUnitSymbol: document.getElementById("telemetry-unit-symbol"),
  telemetryIcon: document.getElementById("telemetry-icon"),
  telemetryFeelsLike: document.getElementById("telemetry-feels-like"),
  telemetryTempRange: document.getElementById("telemetry-temp-range"),
  telemetryVisibility: document.getElementById("telemetry-visibility"),

  // Metrics
  telemetryHumidity: document.getElementById("telemetry-humidity"),
  telemetryWind: document.getElementById("telemetry-wind"),
  telemetryWindDirection: document.getElementById("telemetry-wind-direction"),
  telemetryPressure: document.getElementById("telemetry-pressure"),

  // Forecast Container
  forecastCardsContainer: document.getElementById("forecast-cards-container"),
};

/* ============================================================
   Helper Functions
   ============================================================ */

/** Degrees to Compass Heading */
function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[val % 16] || "N";
}

/** Unit conversion helpers */
function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}

function mpsToKmh(mps) {
  return mps * 3.6;
}

function formatTemperature(val) {
  return Math.round(val);
}

/** Formatted Local Time */
function formatLocalTime(timestampSeconds, timezoneOffsetSeconds) {
  const localMillis = (timestampSeconds + timezoneOffsetSeconds) * 1000;
  const d = new Date(localMillis);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dayName = days[d.getUTCDay()];
  const monthName = months[d.getUTCMonth()];
  const dayNum = d.getUTCDate();
  const year = d.getUTCFullYear();

  let hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${dayName}, ${monthName} ${dayNum}, ${year} • ${hours}:${minutes} ${ampm}`;
}

/** Weather Condition to Background Theme Class */
function getWeatherThemeClass(weatherCode, iconCode) {
  const isNight = iconCode && iconCode.endsWith("n");

  // Thunderstorm: 2xx
  if (weatherCode >= 200 && weatherCode < 300) return "theme-thunderstorm";
  // Drizzle / Rain: 3xx, 5xx
  if (weatherCode >= 300 && weatherCode < 600) return "theme-rain";
  // Snow: 6xx
  if (weatherCode >= 600 && weatherCode < 700) return "theme-snow";
  // Atmosphere (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado): 7xx
  if (weatherCode >= 700 && weatherCode < 800) return "theme-mist";
  // Clear: 800
  if (weatherCode === 800) return isNight ? "theme-clear-night" : "theme-clear-day";
  // Clouds: 801-804
  if (weatherCode > 800) return isNight ? "theme-clear-night" : "theme-clouds";

  return "theme-clear-day";
}

/** Get reliable high-res weather icon url */
function getWeatherIconUrl(iconCode) {
  if (!iconCode) return "";
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

/* ============================================================
   UI View State Toggles
   ============================================================ */
function showLoading() {
  hideError();
  elements.loadingState.classList.remove("hidden");
  elements.weatherDisplay.classList.add("hidden");
  elements.fallbackState.classList.add("hidden");
}

function hideLoading() {
  elements.loadingState.classList.add("hidden");
}

function showError(title, message) {
  hideLoading();
  elements.errorTitle.textContent = title;
  elements.errorMessage.textContent = message;
  elements.errorBanner.classList.remove("hidden");
}

function hideError() {
  elements.errorBanner.classList.add("hidden");
}

function showFallback() {
  hideLoading();
  elements.weatherDisplay.classList.add("hidden");
  elements.fallbackState.classList.remove("hidden");
}

/* ============================================================
   Asynchronous API Fetch Functions (fetch + async/await + try/catch)
   ============================================================ */

/**
 * Fetch Current Weather Telemetry
 * @param {string} city
 * @param {string} unit ('metric'|'imperial')
 */
async function fetchCurrentWeather(city, unit) {
  // If user hasn't configured real API key yet, return simulated response smoothly
  if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    return getMockCurrentWeather(city, unit);
  }

  const endpoint = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found. Please verify spelling.`);
    }
    if (response.status === 401) {
      throw new Error("Invalid OpenWeatherMap API Key. Please verify the API_KEY in script.js.");
    }
    throw new Error(`Weather service returned error code ${response.status}.`);
  }

  return await response.json();
}

/**
 * Fetch 5-Day / 3-Hour Forecast Telemetry
 * @param {string} city
 * @param {string} unit ('metric'|'imperial')
 */
async function fetchFiveDayForecast(city, unit) {
  // If API key is placeholder, use mock forecast
  if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    return getMockForecast(city, unit);
  }

  const endpoint = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Could not retrieve 5-day forecast for "${city}".`);
  }

  return await response.json();
}

/**
 * Orchestrator: Fetches both current weather and forecast in parallel
 */
async function fetchAndRenderClimateData(city) {
  const targetCity = city.trim();
  if (!targetCity) {
    showError("Input Required", "Please enter a valid city name to search.");
    return;
  }

  showLoading();

  try {
    // Run current weather and forecast fetches in parallel
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(targetCity, currentUnit),
      fetchFiveDayForecast(targetCity, currentUnit),
    ]);

    cachedWeatherData = currentData;
    cachedForecastData = forecastData;
    currentCity = currentData.name || targetCity;

    renderCurrentWeather(currentData);
    renderFiveDayForecast(forecastData);

    // Reveal weather display
    hideLoading();
    elements.weatherDisplay.classList.remove("hidden");
    elements.fallbackState.classList.add("hidden");
  } catch (error) {
    console.error("AuraCast Telemetry Error:", error);
    showError("Climate Telemetry Error", error.message || "Failed to fetch weather data. Check your connection.");
    showFallback();
  }
}

/* ============================================================
   DOM Rendering: Current Telemetry & Background Gradient
   ============================================================ */
function renderCurrentWeather(data) {
  if (!data || !data.weather || !data.weather[0]) return;

  const weather = data.weather[0];
  const main = data.main;
  const wind = data.wind || { speed: 0, deg: 0 };
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const speedUnit = currentUnit === "metric" ? "km/h" : "mph";

  // 1. Dynamic Background & Theme
  const themeClass = getWeatherThemeClass(weather.id, weather.icon);
  document.body.className = themeClass;

  // 2. City & Local Time
  elements.telemetryCity.textContent = `${data.name}, ${data.sys.country || ""}`;
  elements.telemetryTime.textContent = formatLocalTime(data.dt, data.timezone || 0);

  // 3. Condition & Icon
  elements.telemetryConditionText.textContent = weather.description;
  elements.telemetryIcon.src = getWeatherIconUrl(weather.icon);
  elements.telemetryIcon.alt = weather.description;

  // 4. Primary Temperature
  elements.telemetryTemp.textContent = formatTemperature(main.temp);
  elements.telemetryUnitSymbol.textContent = unitSymbol;

  // 5. Hero Summary Chips
  elements.telemetryFeelsLike.textContent = `${formatTemperature(main.feels_like)}${unitSymbol}`;
  elements.telemetryTempRange.textContent = `${formatTemperature(main.temp_max)}° / ${formatTemperature(main.temp_min)}°`;

  const visibilityKm = data.visibility ? (data.visibility / 1000).toFixed(1) + " km" : "N/A";
  elements.telemetryVisibility.textContent = visibilityKm;

  // 6. Climate Metrics
  elements.telemetryHumidity.textContent = `${main.humidity}%`;

  const windSpeedVal = currentUnit === "metric" ? mpsToKmh(wind.speed).toFixed(1) : wind.speed.toFixed(1);
  elements.telemetryWind.textContent = `${windSpeedVal} ${speedUnit}`;

  const compassHeading = degToCompass(wind.deg || 0);
  elements.telemetryWindDirection.textContent = `${compassHeading} (${wind.deg || 0}°)`;

  elements.telemetryPressure.textContent = `${main.pressure} hPa`;
}

/* ============================================================
   DOM Rendering: 5-Day Forecast via Array.map()
   ============================================================ */

/**
 * Groups 3-hour forecast timestamps into 5 distinct consecutive days
 * and calculates min/max temp and representative weather condition
 */
function processForecastList(list) {
  if (!Array.isArray(list)) return [];

  const dayBuckets = {};

  list.forEach((item) => {
    // Extract date YYYY-MM-DD
    const dateStr = item.dt_txt ? item.dt_txt.split(" ")[0] : new Date(item.dt * 1000).toISOString().split("T")[0];

    if (!dayBuckets[dateStr]) {
      dayBuckets[dateStr] = [];
    }
    dayBuckets[dateStr].push(item);
  });

  const dates = Object.keys(dayBuckets);
  // Pick up to 5 days
  const targetDates = dates.slice(0, 5);

  return targetDates.map((dateKey, index) => {
    const bucket = dayBuckets[dateKey];

    // Pick midday forecast item (e.g. 12:00 or middle of bucket) for representative icon/condition
    const midIndex = Math.floor(bucket.length / 2);
    const representative = bucket[midIndex] || bucket[0];

    // Min and Max across all 3-hour chunks for this day
    const minTemp = Math.min(...bucket.map((b) => b.main.temp_min));
    const maxTemp = Math.max(...bucket.map((b) => b.main.temp_max));

    const dateObj = new Date(dateKey + "T12:00:00Z");
    const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const isToday = index === 0;
    const dayLabel = isToday ? "Today" : daysShort[dateObj.getUTCDay()];
    const dateLabel = `${monthsShort[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}`;

    return {
      dateKey,
      dayLabel,
      dateLabel,
      isToday,
      condition: representative.weather[0].description,
      icon: representative.weather[0].icon,
      minTemp: formatTemperature(minTemp),
      maxTemp: formatTemperature(maxTemp),
    };
  });
}

/**
 * Renders forecast cards using Array.map() as required
 */
function renderFiveDayForecast(forecastData) {
  if (!forecastData || !forecastData.list) return;

  const processedDays = processForecastList(forecastData.list);

  // Using Array.map() to construct responsive cards array
  const forecastCardsHtml = processedDays.map((day) => {
    const iconUrl = getWeatherIconUrl(day.icon);
    return `
      <div class="forecast-card ${day.isToday ? 'is-today' : ''}" role="article" aria-label="Forecast for ${day.dayLabel}">
        <span class="forecast-day">${day.dayLabel}</span>
        <span class="forecast-date">${day.dateLabel}</span>
        
        <div class="forecast-icon-box">
          <img src="${iconUrl}" alt="${day.condition}" class="forecast-icon" loading="lazy">
        </div>

        <span class="forecast-condition">${day.condition}</span>

        <div class="forecast-temps">
          <span class="forecast-temp-max">${day.maxTemp}°</span>
          <span class="forecast-temp-min">${day.minTemp}°</span>
        </div>
      </div>
    `;
  }).join("");

  elements.forecastCardsContainer.innerHTML = forecastCardsHtml;
}

/* ============================================================
   Unit Toggle Switcher (°C / °F)
   ============================================================ */
function setUnit(newUnit) {
  if (currentUnit === newUnit) return;
  currentUnit = newUnit;

  if (currentUnit === "metric") {
    elements.unitCBtn.classList.add("active");
    elements.unitCBtn.setAttribute("aria-checked", "true");
    elements.unitFBtn.classList.remove("active");
    elements.unitFBtn.setAttribute("aria-checked", "false");
  } else {
    elements.unitFBtn.classList.add("active");
    elements.unitFBtn.setAttribute("aria-checked", "true");
    elements.unitCBtn.classList.remove("active");
    elements.unitCBtn.setAttribute("aria-checked", "false");
  }

  // Refetch with new unit for accurate API conversions
  fetchAndRenderClimateData(currentCity);
}

/* ============================================================
   Mock Telemetry Generators for Zero-Config Preview
   ============================================================ */
function getMockCurrentWeather(city, unit) {
  // Normalize lookup key
  const matchKey = Object.keys(MOCK_DATA).find((k) => k.toLowerCase() === city.toLowerCase());
  const template = matchKey ? MOCK_DATA[matchKey] : MOCK_DATA.Sylhet;

  // Deep clone
  const data = JSON.parse(JSON.stringify(template));
  if (!matchKey) {
    data.name = city.charAt(0).toUpperCase() + city.slice(1);
  }

  // Convert if imperial
  if (unit === "imperial") {
    data.main.temp = celsiusToFahrenheit(data.main.temp);
    data.main.feels_like = celsiusToFahrenheit(data.main.feels_like);
    data.main.temp_min = celsiusToFahrenheit(data.main.temp_min);
    data.main.temp_max = celsiusToFahrenheit(data.main.temp_max);
    data.wind.speed = data.wind.speed * 0.621371; // m/s to mph
  }

  return new Promise((resolve) => setTimeout(() => resolve(data), 350));
}

function getMockForecast(city, unit) {
  const matchKey = Object.keys(MOCK_DATA).find((k) => k.toLowerCase() === city.toLowerCase());
  const base = matchKey ? MOCK_DATA[matchKey] : MOCK_DATA.Sylhet;

  const list = [];
  const now = Math.floor(Date.now() / 1000);

  // Generate 5 days of mock intervals
  for (let d = 0; d < 5; d++) {
    const dayTimestamp = now + d * 86400;
    const dateObj = new Date(dayTimestamp * 1000);
    const dateStr = dateObj.toISOString().split("T")[0];

    const tempDelta = (d % 2 === 0 ? 1 : -1) * d * 0.8;
    let baseTemp = base.main.temp + tempDelta;
    if (unit === "imperial") {
      baseTemp = celsiusToFahrenheit(baseTemp);
    }

    list.push({
      dt: dayTimestamp,
      dt_txt: `${dateStr} 12:00:00`,
      main: {
        temp: baseTemp,
        temp_min: baseTemp - 3,
        temp_max: baseTemp + 4,
      },
      weather: [base.weather[0]],
    });
  }

  return new Promise((resolve) => setTimeout(() => resolve({ list }), 350));
}

/* ============================================================
   Event Handlers & Initialization
   ============================================================ */
function initEventListeners() {
  // Search form submission
  elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = elements.cityInput.value.trim();
    if (query) {
      fetchAndRenderClimateData(query);
    }
  });

  // Clear search input button
  elements.cityInput.addEventListener("input", (e) => {
    if (e.target.value.trim().length > 0) {
      elements.clearSearchBtn.classList.remove("hidden");
    } else {
      elements.clearSearchBtn.classList.add("hidden");
    }
  });

  elements.clearSearchBtn.addEventListener("click", () => {
    elements.cityInput.value = "";
    elements.clearSearchBtn.classList.add("hidden");
    elements.cityInput.focus();
  });

  // Quick City Chips
  elements.chipButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.dataset.city;
      if (city) {
        elements.cityInput.value = city;
        elements.clearSearchBtn.classList.remove("hidden");
        fetchAndRenderClimateData(city);
      }
    });
  });

  // Unit Switcher
  elements.unitCBtn.addEventListener("click", () => setUnit("metric"));
  elements.unitFBtn.addEventListener("click", () => setUnit("imperial"));

  // Dismiss error banner
  elements.dismissErrorBtn.addEventListener("click", hideError);
}

// App Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  // Fetch initial telemetry for Sylhet (default city)
  fetchAndRenderClimateData(DEFAULT_CITY);
});

# Task 3: AuraCast — Real-Time Weather Forecast & Climate Telemetry

A sleek, mobile-first responsive **Real-Time Weather Forecast & Climate Telemetry App** built with semantic **HTML5**, **CSS Flexbox** (with dynamic weather & day/night gradients), and pure **Vanilla JavaScript (ES6+)**, integrating a third-party REST API (**OpenWeatherMap API**).

---

## 🌐 Live Demonstration

- **Live URL:** [https://weather-update-plum.vercel.app](https://weather-update-plum.vercel.app)
- **Repository Path:** `./Task-3/`

---

## ✨ Features & Architecture

### 1. Telemetry Dashboard & Instant Search
- **City Search:** Search any city worldwide with instant form submission (`Enter` key supported) and clear button.
- **Quick City Chips:** One-click quick selection for popular cities (*Sylhet*, *Dhaka*, *London*, *Tokyo*, *New York*).
- **Unit Toggle:** Switch seamlessly between **°C** (Metric) and **°F** (Imperial) units with automatic refetch.
- **Current Weather Metrics:**
  - Real-time temperature, condition badge, and high-resolution weather icon.
  - Localized date/time for the searched city.
  - Feels-like temperature, daily High/Low range, and visibility distance.
  - **Key Climate Telemetry Cards:** Humidity (%), Wind Speed with compass heading, and Atmospheric Pressure (hPa).

### 2. 5-Day Atmospheric Forecast (Array.map())
- Dynamically processes 3-hour forecast data into 5 consecutive daily projections.
- Renders responsive daily forecast cards via `Array.map()`, displaying Day, Date, condition icon, condition text, and High/Low temperatures.

### 3. Dynamic Weather & Time-of-Day Themes
- Automatically updates background gradients and floating atmospheric glow orbs according to the current weather condition and day/night state:
  - ☀️ **Clear Day:** Warm golden sunlight & bright sky gradient.
  - 🌙 **Clear Night:** Deep celestial indigo & starlight purple glow.
  - ☁️ **Clouds / Overcast:** Cool slate and atmospheric gray.
  - 🌧️ **Rain & Drizzle:** Deep storm navy with cyan accents.
  - ⛈️ **Thunderstorm:** Electric violet and dark twilight.
  - ❄️ **Snow & Mist:** Crisp frosted slate.

### 4. Robust API & Error Handling
- Asynchronous data fetching using `fetch()`, `async/await`, and `try-catch` blocks.
- Smooth loading spinner state during network requests.
- User-friendly error alert banner for unknown cities or network interruptions.
- Built-in mock telemetry fallback for zero-config preview before configuring a personal API key.

---

## 🛠️ API Key Setup (OpenWeatherMap)

1. Get a free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Open `script.js` and set your key at the top:
   ```javascript
   const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
   ```

---

## 📂 File Structure

```
Task-3/
├── index.html   # Semantic HTML5 layout & accessible components
├── style.css    # CSS Flexbox, dynamic weather themes, animations
├── script.js    # Fetch API, async/await, Array.map(), weather logic
└── README.md    # Task documentation & live link
```

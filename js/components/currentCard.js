/**
 * Componente para renderizar o card de Clima Atual
 */
const CurrentCard = {
  render(containerId, currentData, localityName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const weatherInfo = WeatherFormatters.getWeatherInfo(currentData.weatherCode);

    container.innerHTML = `
      <div class="weather-header-now">
        Agora &bull; ${localityName}
      </div>
      <div class="temp-row">
        <div class="main-temp">${WeatherFormatters.formatTemp(currentData.temp)}</div>
        <div class="weather-status-box">
          <div class="weather-status-title">${weatherInfo.label} ${weatherInfo.icon}</div>
          <div class="weather-sensation">Sensação térmica: ${WeatherFormatters.formatTemp(currentData.feelsLike)}</div>
        </div>
      </div>
    `;
  }
};


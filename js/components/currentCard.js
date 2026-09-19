/** Componente para renderizar o clima atual ou o dia selecionado. */
const CurrentCard = {
  render(containerId, currentData, localityName, selectedDaily = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const safeLocality = WeatherFormatters.escapeHtml(localityName);
    if (selectedDaily) {
      const weatherInfo = WeatherFormatters.getWeatherInfo(selectedDaily.weatherCode);
      container.innerHTML = `<div class="weather-header-now">Previsão &bull; ${safeLocality}</div>
        <div class="temp-row"><div class="main-temp">${WeatherFormatters.formatTemp(selectedDaily.maxTemp)}</div>
        <div class="weather-status-box"><div class="weather-status-title">${weatherInfo.label} <span aria-hidden="true">${weatherInfo.icon}</span></div>
        <div class="weather-sensation">Mínima: ${WeatherFormatters.formatTemp(selectedDaily.minTemp)}</div></div></div>`;
      return;
    }
    const weatherInfo = WeatherFormatters.getWeatherInfo(currentData.weatherCode);
    container.innerHTML = `<div class="weather-header-now">Agora &bull; ${safeLocality}</div>
      <div class="temp-row"><div class="main-temp">${WeatherFormatters.formatTemp(currentData.temp)}</div>
      <div class="weather-status-box"><div class="weather-status-title">${weatherInfo.label} <span aria-hidden="true">${weatherInfo.icon}</span></div>
      <div class="weather-sensation">Sensação térmica: ${WeatherFormatters.formatTemp(currentData.feelsLike)}</div></div></div>`;
  }
};

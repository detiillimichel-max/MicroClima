/**
 * Componente para renderizar a Previsão Diária (Próximos Dias)
 */
const DailyForecast = {
  render(containerId, dailyList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cardsHtml = dailyList.map((item, index) => {
      const dayLabel = WeatherFormatters.formatDayName(item.date, index);
      const info = WeatherFormatters.getWeatherInfo(item.weatherCode);
      const isActive = index === 0 ? 'active' : '';

      return `
        <div class="daily-card ${isActive}">
          <span class="daily-day">${dayLabel}</span>
          <span class="daily-icon">${info.icon}</span>
          <span class="daily-temp">${WeatherFormatters.formatTemp(item.maxTemp)}/${WeatherFormatters.formatTemp(item.minTemp)}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = cardsHtml;
  }
};

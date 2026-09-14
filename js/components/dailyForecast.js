/**
 * Componente para renderizar a Previsão Diária (Próximos Dias)
 */
const DailyForecast = {
  render(containerId, dailyList, selectedIndex = 0, onSelect = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cardsHtml = dailyList.map((item, index) => {
      const dayLabel = WeatherFormatters.formatDayName(item.date, index);
      const info = WeatherFormatters.getWeatherInfo(item.weatherCode);
      const isActive = index === selectedIndex ? 'active' : '';

      return `
        <button class="daily-card ${isActive}" type="button" data-day-index="${index}" aria-pressed="${index === selectedIndex}">
          <span class="daily-day">${dayLabel}</span>
          <span class="daily-icon">${info.icon}</span>
          <span class="daily-temp">${WeatherFormatters.formatTemp(item.maxTemp)}/${WeatherFormatters.formatTemp(item.minTemp)}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = cardsHtml;

    if (typeof onSelect === 'function') {
      container.querySelectorAll('[data-day-index]').forEach(button => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.dayIndex);
          onSelect(index);
        });
      });
    }
  }
};

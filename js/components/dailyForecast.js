/**
 * Componente para renderizar a Previsão Diária.
 * O clique é tratado por delegação para continuar funcionando
 * mesmo depois de o conteúdo ser redesenhado.
 */
const DailyForecast = {
  render(containerId, dailyList, selectedIndex = 0, onSelect = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const safeIndex = Math.min(Math.max(Number(selectedIndex) || 0, 0), Math.max(dailyList.length - 1, 0));

    container.innerHTML = dailyList.map((item, index) => {
      const dayLabel = WeatherFormatters.formatDayName(item.date, index);
      const info = WeatherFormatters.getWeatherInfo(item.weatherCode);
      const isActive = index === safeIndex ? 'active' : '';

      return `
        <button class="daily-card ${isActive}" type="button" data-day-index="${index}" aria-pressed="${index === safeIndex}">
          <span class="daily-day">${dayLabel}</span>
          <span class="daily-icon">${info.icon}</span>
          <span class="daily-temp">${WeatherFormatters.formatTemp(item.maxTemp)}/${WeatherFormatters.formatTemp(item.minTemp)}</span>
          <span class="daily-rain">☔ ${WeatherFormatters.formatPercent(item.rainProbMax)}</span>
        </button>
      `;
    }).join('');

    container.onclick = event => {
      const button = event.target.closest('[data-day-index]');
      if (!button || !container.contains(button)) return;
      const index = Number(button.dataset.dayIndex);
      if (typeof onSelect === 'function' && Number.isInteger(index)) {
        onSelect(index);
      }
    };
  }
};

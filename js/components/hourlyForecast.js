/** Componente para renderizar a previsão hora a hora. */
const HourlyForecast = {
  render(containerId, hourlyList, selectedDate = null, currentTime = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let selectedHours;
    if (selectedDate) {
      selectedHours = hourlyList.filter(item => item.time.slice(0, 10) === selectedDate).slice(0, 24);
    } else {
      const nowKey = currentTime || '';
      const nowIndex = nowKey ? hourlyList.findIndex(item => item.time >= nowKey) : 0;
      selectedHours = hourlyList.slice(Math.max(nowIndex, 0), Math.max(nowIndex, 0) + 24);
    }
    container.innerHTML = selectedHours.map((item, index) => {
      const info = WeatherFormatters.getWeatherInfo(item.weatherCode);
      const rainText = Number(item.rainProb) > 0 ? WeatherFormatters.formatPercent(item.rainProb) : '';
      return `<div class="hourly-item" aria-label="${WeatherFormatters.formatHour(item.time)}, ${WeatherFormatters.formatTemp(item.temp)}, ${info.label}">
        <span class="temp">${WeatherFormatters.formatTemp(item.temp)}</span>
        <span class="rain-prob">${rainText || '&nbsp;'}</span>
        <span class="icon" aria-hidden="true">${info.icon}</span>
        <span class="time">${!selectedDate && index === 0 ? 'Agora' : WeatherFormatters.formatHour(item.time)}</span>
      </div>`;
    }).join('') || '<p class="empty-results">Previsão horária indisponível para este dia.</p>';
  }
};

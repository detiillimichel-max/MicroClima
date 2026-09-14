/**
 * Componente para renderizar a Previsão Hora a Hora
 */
const HourlyForecast = {
  render(containerId, hourlyList, selectedDate = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let selectedHours;
    if (selectedDate) {
      selectedHours = hourlyList.filter(item => item.time.slice(0, 10) === selectedDate).slice(0, 24);
    } else {
      const now = new Date();
      const nowIndex = hourlyList.findIndex(item => new Date(item.time) >= now);
      const startIndex = nowIndex >= 0 ? nowIndex : 0;
      selectedHours = hourlyList.slice(startIndex, startIndex + 24);
    }

    const itemsHtml = selectedHours.map((item, index) => {
      const timeLabel = !selectedDate && index === 0 ? 'Agora' : WeatherFormatters.formatHour(item.time);
      const info = WeatherFormatters.getWeatherInfo(item.weatherCode);
      const rainText = item.rainProb > 0 ? `${WeatherFormatters.formatPercent(item.rainProb)}` : '';

      return `
        <div class="hourly-item">
          <span class="temp">${WeatherFormatters.formatTemp(item.temp)}</span>
          ${rainText ? `<span class="rain-prob">${rainText}</span>` : '<span class="rain-prob">&nbsp;</span>'}
          <span class="icon">${info.icon}</span>
          <span class="time">${timeLabel}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = itemsHtml || '<p class="empty-results">Previsão horária indisponível para este dia.</p>';
  }
};


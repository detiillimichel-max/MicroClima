/**
 * Componente para renderizar a Previsão Hora a Hora
 */
const HourlyForecast = {
  render(containerId, hourlyList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Obtém a hora atual para exibir as próximas 24h a partir de "Agora"
    const nowHour = new Date().getHours();
    const next24h = hourlyList.slice(nowHour, nowHour + 24);

    const itemsHtml = next24h.map((item, index) => {
      const timeLabel = index === 0 ? 'Agora' : WeatherFormatters.formatHour(item.time);
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

    container.innerHTML = itemsHtml;
  }
};


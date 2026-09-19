/** Módulo de formatação e tradução meteorológica. */
const WeatherFormatters = {
  WMO_CODES: {
    0: { label: 'Céu limpo', icon: '☀️' }, 1: { label: 'Predominantemente limpo', icon: '🌤️' },
    2: { label: 'Parcialmente nublado', icon: '⛅' }, 3: { label: 'Nublado', icon: '☁️' },
    45: { label: 'Névoa', icon: '🌫️' }, 48: { label: 'Névoa com geada', icon: '🌫️' },
    51: { label: 'Garoa leve', icon: '🌦️' }, 53: { label: 'Garoa moderada', icon: '🌦️' }, 55: { label: 'Garoa densa', icon: '🌧️' },
    61: { label: 'Chuva leve', icon: '🌧️' }, 63: { label: 'Chuva moderada', icon: '🌧️' }, 65: { label: 'Chuva forte', icon: '🌧️' },
    71: { label: 'Neve leve', icon: '🌨️' }, 73: { label: 'Neve moderada', icon: '🌨️' }, 75: { label: 'Neve intensa', icon: '❄️' },
    80: { label: 'Pancadas de chuva leves', icon: '🌦️' }, 81: { label: 'Pancadas de chuva moderadas', icon: '🌧️' }, 82: { label: 'Pancadas de chuva violentas', icon: '⛈️' },
    95: { label: 'Trovoada leve/moderada', icon: '🌩️' }, 96: { label: 'Trovoada com granizo leve', icon: '⛈️' }, 99: { label: 'Trovoada com granizo forte', icon: '⛈️' }
  },
  getWeatherInfo(code) { return this.WMO_CODES[code] || { label: 'Condição variável', icon: '🌡️' }; },
  formatTemp(temp) { return Number.isFinite(Number(temp)) ? `${Math.round(temp)}°` : '—'; },
  formatPercent(val) { return Number.isFinite(Number(val)) ? `${Math.round(val)}%` : '—'; },
  formatHour(isoString) {
    const match = String(isoString || '').match(/T(\d{2}):\d{2}/);
    return match ? `${match[1]}:00` : '—';
  },
  formatDayName(isoString, index) {
    if (index === 0) return 'hoje';
    const date = new Date(`${isoString}T00:00:00`);
    return ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'][date.getDay()];
  },
  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }
};

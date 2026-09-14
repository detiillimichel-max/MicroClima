/**
 * Módulo de Formatação e Tradução Meteorológica
 */

const WeatherFormatters = {
  /**
   * Tabela de mapeamento dos códigos WMO da Open-Meteo
   */
  WMO_CODES: {
    0: { label: 'Céu limpo', icon: '☀️' },
    1: { label: 'Predominantemente limpo', icon: '🌤️' },
    2: { label: 'Parcialmente nublado', icon: '⛅' },
    3: { label: 'Nublado', icon: '☁️' },
    45: { label: 'Névoa', icon: '🌫️' },
    48: { label: 'Névoa com geada', icon: '🌫️' },
    51: { label: 'Garoa leve', icon: '🌦️' },
    53: { label: 'Garoa moderada', icon: '🌦️' },
    55: { label: 'Garoa densa', icon: '🌧️' },
    61: { label: 'Chuva leve', icon: '🌧️' },
    63: { label: 'Chuva moderada', icon: '🌧️' },
    65: { label: 'Chuva forte', icon: '🌧️' },
    71: { label: 'Neve leve', icon: '🌨️' },
    73: { label: 'Neve moderada', icon: '🌨️' },
    75: { label: 'Neve intensa', icon: '❄️' },
    80: { label: 'Pancadas de chuva leves', icon: '🌦️' },
    81: { label: 'Pancadas de chuva moderadas', icon: '🌧️' },
    82: { label: 'Pancadas de chuva violentas', icon: '⛈️' },
    95: { label: 'Trovoada leve/moderada', icon: '🌩️' },
    96: { label: 'Trovoada com granizo leve', icon: '⛈️' },
    99: { label: 'Trovoada com granizo forte', icon: '⛈️' }
  },

  /**
   * Retorna a descrição e ícone com base no código OMM
   */
  getWeatherInfo(code) {
    return this.WMO_CODES[code] || { label: 'Condição variável', icon: '🌡️' };
  },

  /**
   * Formata temperatura (arredondando)
   */
  formatTemp(temp) {
    return Math.round(temp) + '°';
  },

  /**
   * Formata probabilidade ou porcentagem
   */
  formatPercent(val) {
    return Math.round(val) + '%';
  },

  /**
   * Converte ISO date para hora formatada (ex: "08:00")
   */
  formatHour(isoString) {
    const date = new Date(isoString);
    const hour = date.getHours().toString().padStart(2, '0');
    return `${hour}:00`;
  },

  /**
   * Converte ISO date para dia da semana curto (ex: "seg.", "ter.")
   */
  formatDayName(isoString, index) {
    if (index === 0) return 'hoje';
    const date = new Date(isoString + 'T00:00:00');
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
    return days[date.getDay()];
  }
};

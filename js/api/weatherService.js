/**
 * Módulo de Serviço de Dados Meteorológicos (Open-Meteo API)
 */

const WeatherService = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',

  /**
   * Busca a previsão completa (Atual, Hora a Hora e 7 Dias)
   * @param {number} latitude 
   * @param {number} longitude 
   */
  async fetchWeatherData(latitude, longitude) {
    const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      // Dados no instante atual
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'wind_speed_10m'
      ].join(','),
      // Dados hora a hora (próximas 24h)
      hourly: [
        'temperature_2m',
        'precipitation_probability',
        'weather_code'
      ].join(','),
      // Dados diários (7 dias)
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max'
      ].join(','),
      timezone: 'auto'
    });

    try {
      const response = await fetch(`${this.BASE_URL}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      return this._structureWeatherData(data);
    } catch (error) {
      console.error('Falha ao obter dados meteorológicos:', error);
      throw error;
    }
  },

  /**
   * Estrutura e limpa os dados brutos recebidos da API
   */
  _structureWeatherData(raw) {
    return {
      current: {
        temp: raw.current.temperature_2m,
        feelsLike: raw.current.apparent_temperature,
        humidity: raw.current.relative_humidity_2m,
        precipitation: raw.current.precipitation,
        weatherCode: raw.current.weather_code,
        windSpeed: raw.current.wind_speed_10m,
        isDay: raw.current.is_day
      },
      hourly: raw.hourly.time.map((time, idx) => ({
        time: time,
        temp: raw.hourly.temperature_2m[idx],
        rainProb: raw.hourly.precipitation_probability[idx],
        weatherCode: raw.hourly.weather_code[idx]
      })),
      daily: raw.daily.time.map((date, idx) => ({
        date: date,
        maxTemp: raw.daily.temperature_2m_max[idx],
        minTemp: raw.daily.temperature_2m_min[idx],
        rainProbMax: raw.daily.precipitation_probability_max[idx],
        weatherCode: raw.daily.weather_code[idx]
      }))
    };
  }
};


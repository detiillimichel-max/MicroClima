/* Serviço meteorológico Open-Meteo com cache local de seis horas. */
const WeatherService = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',

  async fetchWeatherData(latitude, longitude, forecastDays = 7, forceRefresh = false) {
    const days = Math.min(Math.max(Number(forecastDays) || 7, 3), 7);
    const cacheKey = `weather:${latitude.toFixed(3)}:${longitude.toFixed(3)}:${days}`;
    if (!forceRefresh) {
      const cached = MicroClimaCache.read(cacheKey);
      if (cached) return cached;
    }

    const params = new URLSearchParams({
      latitude, longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: days,
      timezone: 'auto'
    });

    const response = await fetch(`${this.BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    const structured = this._structureWeatherData(await response.json());
    MicroClimaCache.write(cacheKey, structured);
    return structured;
  },

  _structureWeatherData(raw) {
    const currentCode = raw.current.weather_code;
    const alert = [95, 96, 99].includes(currentCode)
      ? { level: 'warning', text: 'Atenção: possibilidade de trovoadas ou tempestades na região.' }
      : null;
    return {
      current: {
        temp: raw.current.temperature_2m, feelsLike: raw.current.apparent_temperature,
        humidity: raw.current.relative_humidity_2m, precipitation: raw.current.precipitation,
        weatherCode: currentCode, windSpeed: raw.current.wind_speed_10m, isDay: raw.current.is_day
      },
      hourly: raw.hourly.time.map((time, idx) => ({ time, temp: raw.hourly.temperature_2m[idx], rainProb: raw.hourly.precipitation_probability[idx], weatherCode: raw.hourly.weather_code[idx] })),
      daily: raw.daily.time.map((date, idx) => ({ date, maxTemp: raw.daily.temperature_2m_max[idx], minTemp: raw.daily.temperature_2m_min[idx], rainProbMax: raw.daily.precipitation_probability_max[idx], weatherCode: raw.daily.weather_code[idx] })),
      alert
    };
  }
};

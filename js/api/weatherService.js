/* Serviço meteorológico Open-Meteo com cache local e fallback offline. */
const WeatherService = {
  BASE_URL: 'https://api.open-meteo.com/v1/forecast',

  async fetchWeatherData(latitude, longitude, forecastDays = 7, forceRefresh = false, signal = undefined) {
    const days = Math.min(Math.max(Number(forecastDays) || 7, 3), 7);
    const cacheKey = `weather:${latitude.toFixed(3)}:${longitude.toFixed(3)}:${days}`;
    const cachedEntry = MicroClimaCache.readEntry(cacheKey);

    if (!forceRefresh) {
      const cached = MicroClimaCache.read(cacheKey);
      if (cached) return { ...cached, stale: false, cachedAt: cachedEntry?.savedAt || null };
    }

    const params = new URLSearchParams({
      latitude, longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: days,
      timezone: 'auto'
    });

    try {
      const response = await fetch(`${this.BASE_URL}?${params.toString()}`, { signal });
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
      const structured = this._structureWeatherData(await response.json());
      MicroClimaCache.write(cacheKey, structured);
      return { ...structured, stale: false, cachedAt: Date.now() };
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (cachedEntry?.value) {
        return { ...cachedEntry.value, stale: true, cachedAt: cachedEntry.savedAt };
      }
      throw error;
    }
  },

  _structureWeatherData(raw) {
    if (!raw?.current || !raw?.hourly || !raw?.daily) throw new Error('Resposta meteorológica incompleta');
    const currentCode = raw.current.weather_code;
    const alert = [95, 96, 99].includes(currentCode)
      ? { level: 'warning', text: 'Atenção: possibilidade de trovoadas ou tempestades na região.' }
      : null;
    return {
      timezone: raw.timezone,
      current: {
        time: raw.current.time,
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

/* Controlador principal do MicroClima. */
let selectedLocation = null;
let selectedForecastDays = Number(localStorage.getItem('microclima:forecast-days')) || 7;

 document.addEventListener('DOMContentLoaded', () => {
  const saved = LocationService.getSavedLocation();
  if (saved) selectedLocation = saved;

  LocationPicker.init(handleLocationChoice);
  const daysSelect = document.getElementById('forecast-days');
  if (daysSelect) {
    daysSelect.value = String(selectedForecastDays);
    daysSelect.addEventListener('change', event => {
      selectedForecastDays = Number(event.target.value);
      localStorage.setItem('microclima:forecast-days', String(selectedForecastDays));
      initApp(false);
    });
  }

  document.getElementById('btn-refresh')?.addEventListener('click', () => initApp(true));
  initApp(false);
});

async function handleLocationChoice(choice) {
  if (choice.type === 'city') {
    selectedLocation = {
      latitude: choice.city.latitude, longitude: choice.city.longitude,
      cityName: choice.city.name, stateName: choice.city.state, source: 'city'
    };
    LocationService.saveLocation(selectedLocation);
    await initApp(false);
  } else {
    selectedLocation = null;
    await initApp(true, true);
  }
}

async function initApp(forceRefresh = false, useGps = false) {
  try {
    const location = useGps ? await LocationService.getCurrentCoordinates() : (selectedLocation || LocationService.getSavedLocation() || await LocationService.getCurrentCoordinates());
    if (!location.cityName || location.cityName === 'Sua Localização') {
      location.cityName = await LocationService.getLocalityName(location.latitude, location.longitude);
    }
    selectedLocation = location;
    LocationService.saveLocation(location);

    const weatherData = await WeatherService.fetchWeatherData(location.latitude, location.longitude, selectedForecastDays, forceRefresh);
    const localityName = location.cityName && location.stateName ? `${location.cityName}, ${location.stateName}` : location.cityName;
    CurrentCard.render('current-card', weatherData.current, localityName);
    HourlyForecast.render('hourly-forecast', weatherData.hourly);
    DailyForecast.render('daily-forecast', weatherData.daily);

    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
      if (weatherData.alert) {
        alertBanner.textContent = `⚠ ${weatherData.alert.text}`;
        alertBanner.classList.remove('hidden');
      } else {
        alertBanner.classList.add('hidden');
      }
    }

    const insightCard = document.getElementById('weather-insight');
    const insightText = document.getElementById('insight-text');
    if (insightCard && insightText && weatherData.daily.length > 1) {
      const diff = Math.round(weatherData.daily[1].maxTemp - weatherData.daily[0].maxTemp);
      insightText.textContent = diff >= 2 ? `Previsão de aumento na temperatura de +${diff}°C para amanhã.` : diff <= -2 ? `Previsão de queda na temperatura de ${diff}°C para amanhã.` : 'Temperaturas estáveis nos próximos dias.';
      insightCard.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Erro ao carregar MicroClima:', error);
    document.getElementById('current-card').innerHTML = '<p class="error-message">Não foi possível obter os dados meteorológicos. Tente novamente.</p>';
  }
}

/* Controlador principal do MicroClima. */
let selectedLocation = null;
let selectedForecastDays = Number(localStorage.getItem('microclima:forecast-days')) || 7;
let selectedDayIndex = 0;
let lastWeatherData = null;

function selectForecastDay(index) {
  if (!lastWeatherData || !Array.isArray(lastWeatherData.daily)) return;
  const numericIndex = Number(index);
  if (!Number.isInteger(numericIndex)) return;
  if (numericIndex < 0 || numericIndex >= lastWeatherData.daily.length) return;

  selectedDayIndex = numericIndex;
  renderSelectedDay();
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = LocationService.getSavedLocation();
  if (saved) selectedLocation = saved;

  LocationPicker.init(handleLocationChoice);

  const daysSelect = document.getElementById('forecast-days');
  if (daysSelect) {
    daysSelect.value = String(selectedForecastDays);
    daysSelect.addEventListener('change', event => {
      selectedForecastDays = Number(event.target.value);
      selectedDayIndex = 0;
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
      latitude: choice.city.latitude,
      longitude: choice.city.longitude,
      cityName: choice.city.name,
      stateName: choice.city.state,
      source: 'city'
    };
    selectedDayIndex = 0;
    LocationService.saveLocation(selectedLocation);
    await initApp(false);
  } else {
    selectedLocation = null;
    selectedDayIndex = 0;
    await initApp(true, true);
  }
}

function renderSelectedDay() {
  if (!lastWeatherData || !selectedLocation) return;

  const dailyList = Array.isArray(lastWeatherData.daily) ? lastWeatherData.daily : [];
  if (!dailyList.length) return;

  selectedDayIndex = Math.min(Math.max(selectedDayIndex, 0), dailyList.length - 1);
  const selectedDaily = selectedDayIndex === 0 ? null : dailyList[selectedDayIndex];
  const selectedDate = selectedDaily ? selectedDaily.date : null;
  const localityName = selectedLocation.cityName && selectedLocation.stateName
    ? `${selectedLocation.cityName}, ${selectedLocation.stateName}`
    : selectedLocation.cityName;

  CurrentCard.render('current-card', lastWeatherData.current, localityName, selectedDaily);
  HourlyForecast.render('hourly-forecast', lastWeatherData.hourly, selectedDate);
  DailyForecast.render('daily-forecast', dailyList, selectedDayIndex, selectForecastDay);
}

async function initApp(forceRefresh = false, useGps = false) {
  try {
    const location = useGps
      ? await LocationService.getCurrentCoordinates()
      : (selectedLocation || LocationService.getSavedLocation() || await LocationService.getCurrentCoordinates());

    if (!location.cityName || location.cityName === 'Sua Localização') {
      location.cityName = await LocationService.getLocalityName(location.latitude, location.longitude);
    }

    selectedLocation = location;
    LocationService.saveLocation(location);

    lastWeatherData = await WeatherService.fetchWeatherData(
      location.latitude,
      location.longitude,
      selectedForecastDays,
      forceRefresh
    );

    selectedDayIndex = Math.min(selectedDayIndex, Math.max(lastWeatherData.daily.length - 1, 0));
    renderSelectedDay();

    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
      if (lastWeatherData.alert) {
        alertBanner.textContent = `⚠ ${lastWeatherData.alert.text}`;
        alertBanner.classList.remove('hidden');
      } else {
        alertBanner.classList.add('hidden');
      }
    }

    const insightCard = document.getElementById('weather-insight');
    const insightText = document.getElementById('insight-text');
    if (insightCard && insightText && lastWeatherData.daily.length > 1) {
      const diff = Math.round(lastWeatherData.daily[1].maxTemp - lastWeatherData.daily[0].maxTemp);
      insightText.textContent = diff >= 2
        ? `Previsão de aumento na temperatura de +${diff}°C para amanhã.`
        : diff <= -2
          ? `Previsão de queda na temperatura de ${diff}°C para amanhã.`
          : 'Temperaturas estáveis nos próximos dias.';
      insightCard.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Erro ao carregar MicroClima:', error);
    const currentCard = document.getElementById('current-card');
    if (currentCard) {
      currentCard.innerHTML = '<p class="error-message">Não foi possível obter os dados meteorológicos. Tente novamente.</p>';
    }
  }
}

/* Controlador principal do MicroClima. */
let selectedLocation = null;
let selectedForecastDays = Number(localStorage.getItem('microclima:forecast-days')) || 7;
let selectedDayIndex = 0;
let lastWeatherData = null;
let activeRequestId = 0;
let currentAbortController = null;

function selectForecastDay(index) {
  if (!lastWeatherData || !Array.isArray(lastWeatherData.daily)) return;
  const numericIndex = Number(index);
  if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= lastWeatherData.daily.length) return;
  selectedDayIndex = numericIndex;
  renderSelectedDay();
}

document.addEventListener('DOMContentLoaded', () => {
  selectedLocation = LocationService.getSavedLocation() || null;
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
    selectedLocation = { latitude: choice.city.latitude, longitude: choice.city.longitude, cityName: choice.city.name, stateName: choice.city.state, source: 'city' };
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
  const localityName = selectedLocation.cityName && selectedLocation.stateName ? `${selectedLocation.cityName}, ${selectedLocation.stateName}` : selectedLocation.cityName;
  CurrentCard.render('current-card', lastWeatherData.current, localityName, selectedDaily);
  HourlyForecast.render('hourly-forecast', lastWeatherData.hourly, selectedDaily?.date || null, lastWeatherData.current?.time);
  DailyForecast.render('daily-forecast', dailyList, selectedDayIndex, selectForecastDay);
}

function setLoading(isLoading) {
  const button = document.getElementById('btn-refresh');
  if (button) {
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);
    button.setAttribute('aria-busy', String(isLoading));
  }
  const status = document.getElementById('data-status');
  if (status && isLoading) status.textContent = 'Atualizando previsão…';
}

async function initApp(forceRefresh = false, useGps = false) {
  const requestId = ++activeRequestId;
  currentAbortController?.abort();
  currentAbortController = new AbortController();
  setLoading(true);
  try {
    const location = useGps ? await LocationService.getCurrentCoordinates() : (selectedLocation || LocationService.getSavedLocation() || await LocationService.getCurrentCoordinates());
    if (!location.cityName || location.cityName === 'Sua Localização') location.cityName = await LocationService.getLocalityName(location.latitude, location.longitude);
    if (requestId !== activeRequestId) return;
    selectedLocation = location;
    LocationService.saveLocation(location);
    lastWeatherData = await WeatherService.fetchWeatherData(location.latitude, location.longitude, selectedForecastDays, forceRefresh, currentAbortController.signal);
    if (requestId !== activeRequestId) return;
    selectedDayIndex = Math.min(selectedDayIndex, Math.max(lastWeatherData.daily.length - 1, 0));
    renderSelectedDay();
    const alertBanner = document.getElementById('alert-banner');
    if (alertBanner) {
      alertBanner.textContent = lastWeatherData.alert ? `⚠ ${lastWeatherData.alert.text}` : '';
      alertBanner.classList.toggle('hidden', !lastWeatherData.alert);
    }
    const insightCard = document.getElementById('weather-insight');
    const insightText = document.getElementById('insight-text');
    if (insightCard && insightText && lastWeatherData.daily.length > 1) {
      const diff = Math.round(lastWeatherData.daily[1].maxTemp - lastWeatherData.daily[0].maxTemp);
      insightText.textContent = diff >= 2 ? `Previsão de aumento na temperatura de +${diff}°C para amanhã.` : diff <= -2 ? `Previsão de queda na temperatura de ${diff}°C para amanhã.` : 'Temperaturas estáveis nos próximos dias.';
      insightCard.classList.remove('hidden');
    }
    const status = document.getElementById('data-status');
    if (status) status.textContent = lastWeatherData.stale ? 'Sem conexão: mostrando dados armazenados anteriormente.' : `Atualizado agora · fonte: Open-Meteo`;
  } catch (error) {
    if (error.name === 'AbortError' || requestId !== activeRequestId) return;
    console.error('Erro ao carregar MicroClima:', error);
    const currentCard = document.getElementById('current-card');
    if (currentCard) currentCard.innerHTML = '<p class="error-message">Não foi possível obter os dados. Verifique a conexão e tente novamente.</p>';
    const status = document.getElementById('data-status');
    if (status) status.textContent = 'Falha ao atualizar a previsão.';
  } finally {
    if (requestId === activeRequestId) setLoading(false);
  }
}

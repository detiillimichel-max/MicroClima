/**
 * Controlador Principal do Aplicativo MicroClima
 */
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Evento de clique para o botão de atualização manual (Topo)
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.style.transform = 'rotate(360deg)';
      btnRefresh.style.transition = 'transform 0.6s ease';
      
      initApp().then(() => {
        setTimeout(() => { btnRefresh.style.transform = 'none'; }, 600);
      });
    });
  }
});

async function initApp() {
  try {
    // 1. Captura coordenadas do GPS de alta precisão
    const coords = await LocationService.getCurrentCoordinates();

    // 2. Busca nome do local e dados meteorológicos simultaneamente
    const [localityName, weatherData] = await Promise.all([
      LocationService.getLocalityName(coords.latitude, coords.longitude),
      WeatherService.fetchWeatherData(coords.latitude, coords.longitude)
    ]);

    // 3. Renderiza os blocos visuais na tela
    CurrentCard.render('current-card', weatherData.current, localityName);
    HourlyForecast.render('hourly-forecast', weatherData.hourly);
    DailyForecast.render('daily-forecast', weatherData.daily);

    // 4. Calcula e exibe a tendência de variação de temperatura
    const insightCard = document.getElementById('weather-insight');
    const insightText = document.getElementById('insight-text');

    if (insightCard && insightText && weatherData.daily.length > 1) {
      const today = weatherData.daily[0];
      const tomorrow = weatherData.daily[1];
      const diff = Math.round(tomorrow.maxTemp - today.maxTemp);

      if (diff >= 2) {
        insightText.textContent = `Previsão de aumento na temperatura de +${diff}°C para os próximos dias.`;
      } else if (diff <= -2) {
        insightText.textContent = `Previsão de queda na temperatura de ${diff}°C para amanhã.`;
      } else {
        insightText.textContent = `Temperaturas estáveis nos próximos dias.`;
      }
      insightCard.classList.remove('hidden');
    }

  } catch (error) {
    console.error('Erro ao carregar MicroClima:', error);
    const currentCard = document.getElementById('current-card');
    if (currentCard) {
      currentCard.innerHTML = `<p style="color: #ffaa80; padding: 8px;">Não foi possível obter os dados meteorológicos no momento. Tente novamente.</p>`;
    }
  }
}

/* Seletor de localização: GPS, cidades e pesquisa local. */
const LocationPicker = {
  onSelect: null,
  lastTrigger: null,

  init(onSelect) {
    this.onSelect = onSelect;
    const button = document.getElementById('btn-location');
    const close = document.getElementById('close-location-picker');
    const search = document.getElementById('city-search');
    const gps = document.getElementById('use-my-location');
    const tabs = document.querySelectorAll('[data-city-filter]');
    button?.addEventListener('click', event => this.open(event.currentTarget));
    close?.addEventListener('click', () => this.close());
    gps?.addEventListener('click', () => { this.close(); this.onSelect?.({ type: 'gps' }); });
    search?.addEventListener('input', event => this.renderResults(event.target.value, 'search'));
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      this.renderResults('', tab.dataset.cityFilter);
    }));
    document.getElementById('location-picker')?.addEventListener('click', event => {
      if (event.target.id === 'location-picker') this.close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.getElementById('location-picker')?.classList.contains('hidden')) this.close();
    });
    this.renderResults('', 'sp');
  },

  open(trigger = null) {
    this.lastTrigger = trigger || document.activeElement;
    const modal = document.getElementById('location-picker');
    modal?.classList.remove('hidden');
    modal?.setAttribute('aria-hidden', 'false');
    document.getElementById('city-search')?.focus();
  },

  close() {
    const modal = document.getElementById('location-picker');
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden', 'true');
    this.lastTrigger?.focus?.();
  },

  renderResults(query, filter) {
    const list = document.getElementById('city-results');
    if (!list) return;
    let cities;
    if (filter === 'capital') cities = CityCatalog.capitals;
    else if (filter === 'sp') cities = CityCatalog.saoPaulo;
    else cities = CityCatalog.search(query);
    list.innerHTML = cities.map(city => `<button class="city-result" type="button" data-city-id="${WeatherFormatters.escapeHtml(city.name)}|${WeatherFormatters.escapeHtml(city.state)}"><span class="city-result-main">${WeatherFormatters.escapeHtml(city.name)}</span><span class="city-result-state">${WeatherFormatters.escapeHtml(city.state)} · Brasil</span></button>`).join('') || '<p class="empty-results">Nenhuma cidade encontrada.</p>';
    list.querySelectorAll('.city-result').forEach(button => button.addEventListener('click', () => {
      const [name, state] = button.dataset.cityId.split('|');
      const city = CityCatalog.all.find(item => item.name === name && item.state === state);
      if (city) { this.close(); this.onSelect?.({ type: 'city', city }); }
    }));
  }
};

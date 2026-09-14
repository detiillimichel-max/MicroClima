/* Seletor de localização: GPS, cidades de SP, capitais e pesquisa local. */
const LocationPicker = {
  onSelect: null,

  init(onSelect) {
    this.onSelect = onSelect;
    const button = document.getElementById('btn-location');
    const close = document.getElementById('close-location-picker');
    const search = document.getElementById('city-search');
    const gps = document.getElementById('use-my-location');
    const tabs = document.querySelectorAll('[data-city-filter]');

    button?.addEventListener('click', () => this.open());
    close?.addEventListener('click', () => this.close());
    gps?.addEventListener('click', () => {
      this.close();
      this.onSelect?.({ type: 'gps' });
    });
    search?.addEventListener('input', event => this.renderResults(event.target.value, 'search'));
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      this.renderResults('', tab.dataset.cityFilter);
    }));

    this.renderResults('', 'sp');
  },

  open() {
    document.getElementById('location-picker')?.classList.remove('hidden');
    document.getElementById('city-search')?.focus();
  },

  close() {
    document.getElementById('location-picker')?.classList.add('hidden');
  },

  renderResults(query, filter) {
    const list = document.getElementById('city-results');
    if (!list) return;
    let cities;
    if (filter === 'capital') cities = CityCatalog.capitals;
    else if (filter === 'sp') cities = CityCatalog.saoPaulo;
    else cities = CityCatalog.search(query);

    if (filter === 'search') cities = CityCatalog.search(query);
    list.innerHTML = cities.map(city => `
      <button class="city-result" data-city-id="${city.name}|${city.state}">
        <span class="city-result-main">${city.name}</span>
        <span class="city-result-state">${city.state} · Brasil</span>
      </button>
    `).join('') || '<p class="empty-results">Nenhuma cidade encontrada.</p>';

    list.querySelectorAll('.city-result').forEach(button => button.addEventListener('click', () => {
      const [name, state] = button.dataset.cityId.split('|');
      const city = CityCatalog.all.find(item => item.name === name && item.state === state);
      if (city) {
        this.close();
        this.onSelect?.({ type: 'city', city });
      }
    }));
  }
};

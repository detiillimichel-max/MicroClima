/* Seletor de localização com favoritos e cidades recentes. */
const LocationPicker = {
  onSelect: null,
  lastTrigger: null,
  FAVORITES_KEY: 'microclima:favorite-cities',
  RECENTS_KEY: 'microclima:recent-cities',

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

  readList(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (error) { return []; }
  },

  writeList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (error) { /* armazenamento indisponível */ }
  },

  cityKey(city) { return `${city.name}|${city.state}`; },

  isFavorite(city) {
    return this.readList(this.FAVORITES_KEY).some(item => this.cityKey(item) === this.cityKey(city));
  },

  toggleFavorite(city) {
    const favorites = this.readList(this.FAVORITES_KEY);
    const key = this.cityKey(city);
    const index = favorites.findIndex(item => this.cityKey(item) === key);
    if (index >= 0) favorites.splice(index, 1);
    else favorites.unshift(city);
    this.writeList(this.FAVORITES_KEY, favorites.slice(0, 12));
  },

  addRecent(city) {
    const recents = this.readList(this.RECENTS_KEY).filter(item => this.cityKey(item) !== this.cityKey(city));
    recents.unshift(city);
    this.writeList(this.RECENTS_KEY, recents.slice(0, 6));
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
    else if (filter === 'favorites') cities = this.readList(this.FAVORITES_KEY);
    else if (filter === 'recent') cities = this.readList(this.RECENTS_KEY);
    else cities = CityCatalog.search(query);

    const title = filter === 'favorites' ? '<p class="list-label">Cidades favoritas</p>' : filter === 'recent' ? '<p class="list-label">Consultadas recentemente</p>' : '';
    const cards = cities.map(city => {
      const favorite = this.isFavorite(city);
      const cityId = `${WeatherFormatters.escapeHtml(city.name)}|${WeatherFormatters.escapeHtml(city.state)}`;
      return `<div class="city-result-row">
        <button class="city-result" type="button" data-city-id="${cityId}">
          <span class="city-result-main">${WeatherFormatters.escapeHtml(city.name)}</span>
          <span class="city-result-state">${WeatherFormatters.escapeHtml(city.state)} · Brasil</span>
        </button>
        <button class="favorite-toggle ${favorite ? 'is-favorite' : ''}" type="button" data-favorite-id="${cityId}" aria-label="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" aria-pressed="${favorite}">${favorite ? '★' : '☆'}</button>
      </div>`;
    }).join('');
    list.innerHTML = `${title}${cards || '<p class="empty-results">Nenhuma cidade encontrada. Toque na estrela para salvar uma cidade.</p>'}`;

    list.querySelectorAll('[data-favorite-id]').forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      const [name, state] = button.dataset.favoriteId.split('|');
      const city = CityCatalog.all.find(item => item.name === name && item.state === state) || [...this.readList(this.FAVORITES_KEY), ...this.readList(this.RECENTS_KEY)].find(item => item.name === name && item.state === state);
      if (!city) return;
      this.toggleFavorite(city);
      this.renderResults(query, filter);
    }));

    list.querySelectorAll('.city-result').forEach(button => button.addEventListener('click', () => {
      const [name, state] = button.dataset.cityId.split('|');
      const city = CityCatalog.all.find(item => item.name === name && item.state === state) || [...this.readList(this.FAVORITES_KEY), ...this.readList(this.RECENTS_KEY)].find(item => item.name === name && item.state === state);
      if (city) {
        this.addRecent(city);
        this.close();
        this.onSelect?.({ type: 'city', city });
      }
    }));
  }
};

/* Cache local de clima e localização. TTL padrão: 6 horas. */
const MicroClimaCache = {
  PREFIX: 'microclima:',
  WEATHER_TTL: 6 * 60 * 60 * 1000,

  read(key, ttl = this.WEATHER_TTL) {
    const entry = this.readEntry(key);
    if (!entry) return null;
    if (Date.now() - entry.savedAt > ttl) {
      try { localStorage.removeItem(this.PREFIX + key); } catch (error) { /* armazenamento indisponível */ }
      return null;
    }
    return entry.value;
  },

  readEntry(key) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      return item && item.value !== undefined ? item : null;
    } catch (error) {
      console.warn('Cache indisponível:', error);
      return null;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify({ savedAt: Date.now(), value }));
    } catch (error) {
      console.warn('Não foi possível gravar cache:', error);
    }
  },

  remove(key) {
    try { localStorage.removeItem(this.PREFIX + key); } catch (error) { /* armazenamento indisponível */ }
  }
};

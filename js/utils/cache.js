/* Cache local de clima e localização. TTL padrão: 6 horas. */
const MicroClimaCache = {
  PREFIX: 'microclima:',
  WEATHER_TTL: 6 * 60 * 60 * 1000,

  read(key, ttl = this.WEATHER_TTL) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (!item || Date.now() - item.savedAt > ttl) {
        localStorage.removeItem(this.PREFIX + key);
        return null;
      }
      return item.value;
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

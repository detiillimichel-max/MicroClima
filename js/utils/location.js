/* Serviço de localização com tentativa rápida, fallback e última cidade válida. */
const LocationService = {
  DEFAULT_LOCATION: { latitude: -23.55052, longitude: -46.633309, cityName: 'São Paulo', stateName: 'SP', source: 'fallback' },
  STORAGE_KEY: 'microclima:last-location',

  getSavedLocation() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null; } catch (error) { return null; }
  },

  saveLocation(location) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(location)); } catch (error) { /* armazenamento indisponível */ }
  },

  async getCurrentCoordinates() {
    const quick = await this._getPosition({ enableHighAccuracy: false, timeout: 5000, maximumAge: 15 * 60 * 1000 });
    if (quick) {
      if (!quick.accuracy || quick.accuracy <= 10000) return quick;
      const precise = await this._getPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      return precise || quick;
    }
    return this.DEFAULT_LOCATION;
  },

  _getPosition(options) {
    return new Promise(resolve => {
      if (!('geolocation' in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }),
        () => resolve(null),
        options
      );
    });
  },

  async getLocalityName(lat, lon) {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
      if (!response.ok) throw new Error('Falha ao buscar localidade');
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Sua Localização';
      const state = (data.principalSubdivisionCode || '').replace('BR-', '') || '';
      return state ? `${city}, ${state}` : city;
    } catch (error) {
      console.warn('Erro ao obter nome do local:', error);
      return 'Sua Localização';
    }
  }
};

/**
 * Módulo de Geolocalização de Alta Precisão para o MicroClima
 */

const LocationService = {
  // Coordenadas padrão de fallback (ex: São Paulo - SP) caso o GPS seja negado
  DEFAULT_LOCATION: {
    latitude: -23.55052,
    longitude: -46.633309,
    cityName: 'São Paulo',
    stateName: 'SP'
  },

  /**
   * Obtém as coordenadas GPS atuais com alta precisão do dispositivo
   * @returns {Promise<{latitude: number, longitude: number}>}
   */
  async getCurrentCoordinates() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        console.warn('Geolocalização não suportada. Usando localização padrão.');
        resolve(this.DEFAULT_LOCATION);
        return;
      }

      const options = {
        enableHighAccuracy: true, // Força uso de GPS de alta precisão
        timeout: 10000,           // Tempo limite de 10 segundos
        maximumAge: 0             // Impede uso de cache antigo de localização
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn(`Erro no GPS (${error.code}): ${error.message}. Usando local padrão.`);
          resolve(this.DEFAULT_LOCATION);
        },
        options
      );
    });
  },

  /**
   * Obtém o nome da localidade (Bairro/Cidade) a partir das coordenadas
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<string>} Nome amigável do local
   */
  async getLocalityName(lat, lon) {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`
      );
      
      if (!response.ok) throw new Error('Falha ao buscar nome do local');

      const data = await response.json();
      
      const neighborhood = data.locality || data.city || '';
      const principalSubdivision = data.principalSubdivisionCode || data.principalSubdivision || '';
      
      if (neighborhood && principalSubdivision) {
        return `${neighborhood}, ${principalSubdivision.replace('BR-', '')}`;
      }
      
      return data.city || data.locality || 'Sua Localização';
    } catch (err) {
      console.warn('Erro ao obter nome do local:', err);
      return 'Sua Localização';
    }
  }
};


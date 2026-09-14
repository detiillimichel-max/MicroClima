/*
 * Catálogo local de cidades para o seletor do MicroClima.
 * Coordenadas fixas evitam consultas externas apenas para selecionar uma cidade.
 */
const CityCatalog = {
  capitals: [
    ['Rio Branco', 'AC', -9.9754, -67.8249], ['Maceió', 'AL', -9.6498, -35.7089],
    ['Macapá', 'AP', 0.0349, -51.0694], ['Manaus', 'AM', -3.1190, -60.0217],
    ['Salvador', 'BA', -12.9777, -38.5016], ['Fortaleza', 'CE', -3.7319, -38.5267],
    ['Brasília', 'DF', -15.7939, -47.8828], ['Vitória', 'ES', -20.3155, -40.3128],
    ['Goiânia', 'GO', -16.6869, -49.2648], ['São Luís', 'MA', -2.5307, -44.3068],
    ['Cuiabá', 'MT', -15.6014, -56.0979], ['Campo Grande', 'MS', -20.4697, -54.6201],
    ['Belo Horizonte', 'MG', -19.9167, -43.9345], ['Belém', 'PA', -1.4558, -48.4902],
    ['João Pessoa', 'PB', -7.1195, -34.8450], ['Curitiba', 'PR', -25.4284, -49.2733],
    ['Recife', 'PE', -8.0476, -34.8770], ['Teresina', 'PI', -5.0892, -42.8016],
    ['Porto Alegre', 'RS', -30.0346, -51.2177], ['Porto Velho', 'RO', -8.7612, -63.9004],
    ['Boa Vista', 'RR', 2.8235, -60.6758], ['Florianópolis', 'SC', -27.5954, -48.5480],
    ['São Paulo', 'SP', -23.5505, -46.6333], ['Aracaju', 'SE', -10.9472, -37.0731],
    ['Palmas', 'TO', -10.1840, -48.3336], ['Rio de Janeiro', 'RJ', -22.9068, -43.1729]
  ].map(([name, state, latitude, longitude]) => ({ name, state, latitude, longitude, category: 'capital', isCapital: true })),

  saoPaulo: [
    ['São Paulo', 'SP', -23.5505, -46.6333], ['São Bernardo do Campo', 'SP', -23.6914, -46.5646],
    ['Santo André', 'SP', -23.6639, -46.5383], ['São Caetano do Sul', 'SP', -23.6229, -46.5548],
    ['Diadema', 'SP', -23.6861, -46.6228], ['Mauá', 'SP', -23.6677, -46.4613],
    ['Ribeirão Pires', 'SP', -23.7107, -46.4133], ['Rio Grande da Serra', 'SP', -23.7446, -46.3983],
    ['Guarulhos', 'SP', -23.4543, -46.5337], ['Osasco', 'SP', -23.5329, -46.7917],
    ['Campinas', 'SP', -22.9099, -47.0626], ['Santos', 'SP', -23.9608, -46.3336],
    ['São José dos Campos', 'SP', -23.1896, -45.8841], ['Sorocaba', 'SP', -23.5015, -47.4526],
    ['Jundiaí', 'SP', -23.1852, -46.8978], ['Taubaté', 'SP', -23.0225, -45.5558],
    ['Bauru', 'SP', -22.3145, -49.0587], ['Ribeirão Preto', 'SP', -21.1704, -47.8103],
    ['São José do Rio Preto', 'SP', -20.8113, -49.3758], ['Piracicaba', 'SP', -22.7338, -47.6476],
    ['Mogi das Cruzes', 'SP', -23.5228, -46.1931], ['Atibaia', 'SP', -23.1171, -46.5563],
    ['Bragança Paulista', 'SP', -22.9527, -46.5419], ['Itu', 'SP', -23.2642, -47.2992],
    ['Botucatu', 'SP', -22.8858, -48.4450], ['Franca', 'SP', -20.5386, -47.4008]
  ].map(([name, state, latitude, longitude]) => ({ name, state, latitude, longitude, category: 'sp', isCapital: name === 'São Paulo' }))
};

CityCatalog.all = [...CityCatalog.saoPaulo, ...CityCatalog.capitals.filter(capital => !CityCatalog.saoPaulo.some(city => city.name === capital.name && city.state === capital.state))];
CityCatalog.normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
CityCatalog.search = query => {
  const normalized = CityCatalog.normalize(query);
  if (!normalized) return CityCatalog.all.slice(0, 12);
  return CityCatalog.all.filter(city => CityCatalog.normalize(`${city.name} ${city.state}`).includes(normalized)).slice(0, 20);
};

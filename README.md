# MicroClima

Aplicativo PWA de consulta meteorológica, desenvolvido com HTML, CSS e JavaScript puro, otimizado para uso em celular e publicação no GitHub Pages.

## Funcionalidades

- Clima atual por geolocalização do dispositivo.
- Tentativa rápida de localização aproximada, com alta precisão apenas quando necessário.
- Fallback para São Paulo quando o GPS não estiver disponível.
- Seleção manual de cidades.
- Catálogo local de cidades do estado de São Paulo.
- Catálogo das capitais dos estados e Brasília.
- Pesquisa de cidades por nome ou sigla do estado.
- Persistência da última cidade válida no armazenamento local.
- Cidades favoritas com acesso rápido pelo seletor.
- Histórico das últimas cidades consultadas.
- Cache forte de dados meteorológicos por 6 horas para reduzir chamadas à API.
- Atualização manual pelo botão do cabeçalho.
- Previsão horária.
- Previsão diária configurável para 3, 5 ou 7 dias.
- Indicador de tendência de temperatura.
- Painel com sensação térmica, umidade, chuva, vento e chance de chuva por dia.
- Aviso meteorológico básico para códigos de trovoada/tempo severo retornados pela API.
- PWA com manifest e Service Worker.

> O aviso meteorológico exibido pelo aplicativo é uma indicação baseada nos dados da Open-Meteo. Ele não substitui alertas oficiais da Defesa Civil, INMET ou órgãos locais.

## Estrutura de arquivos

```text
MicroClima/
├── index.html                    # Interface principal e seletor de cidades
├── manifest.json                 # Metadados de instalação do PWA
├── sw.js                         # Cache e comportamento offline do PWA
├── icon-192.png                  # Ícone do aplicativo em 192 px
├── icon-512.png                  # Ícone do aplicativo em 512 px
├── css/
│   └── style.css                 # Tema, cartões, responsividade e modal
└── js/
    ├── app.js                    # Inicialização, troca de cidade e atualização
    ├── api/
    │   └── weatherService.js     # Consulta e normalização da Open-Meteo
    ├── components/
    │   ├── currentCard.js        # Renderiza o clima atual
    │   ├── hourlyForecast.js     # Renderiza a previsão hora a hora
    │   ├── dailyForecast.js      # Renderiza a previsão diária
    │   └── locationPicker.js     # Modal de GPS, pesquisa e seleção
    ├── data/
    │   └── cities.js             # Cidades e capitais com coordenadas
    └── utils/
        ├── formatters.js         # Formatação de datas e condições
        ├── location.js           # GPS, fallback e última cidade válida
        └── cache.js              # Cache local com validade de seis horas
```

## Cache

O cache utiliza `localStorage` com chaves iniciadas por `microclima:`. A previsão é armazenada por combinação de coordenadas e quantidade de dias, com validade de seis horas. O botão de atualização manual força uma nova consulta.

## Fontes de dados

- **Open-Meteo Forecast API:** clima atual, previsão horária e previsão diária.
- **BigDataCloud Reverse Geocoding:** conversão das coordenadas do GPS em nome de cidade.

## Instalação como PWA

O aplicativo precisa ser servido por HTTPS para que a geolocalização e o Service Worker funcionem corretamente. No GitHub Pages, use o endereço publicado para instalar o MicroClima na tela inicial do celular.

## Limitações conhecidas

- O catálogo local contém uma seleção de municípios de São Paulo e todas as capitais. A pesquisa ainda não consulta automaticamente todos os municípios do Brasil.
- O alerta de tempestade é uma indicação meteorológica baseada no código retornado pela API; alertas oficiais dependem de uma integração específica com órgãos públicos.
- O navegador pode exigir nova permissão caso o usuário bloqueie a geolocalização.

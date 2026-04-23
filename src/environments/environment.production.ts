export const environment = {
  production: true,
  version: "1.0.0",
  browser: true,
  menu_type: 'side',
  portal: {
    url: "https://geomem.ialk.com.br/"
  },
  API: {
    storage: "https://storage.ialk.com.br",
    auth: "https://geomemapi.ialk.com.br/api_auth/graphql",
    admin: "https://geomemapi.ialk.com.br/api_auth/graphql",
    geomem: "https://geomemapi.ialk.com.br/api_geomem/graphql",
  },
  Socket: {
    platform: "geomem",
    url: "https://socket.ialk.com.br",
  },
  oneSignal: {
    appId: "e84cc2ee-5c42-490f-a976-58f9349c42d2",
  },
  google: {
    captchaKey: "6Lf6EKspAAAAAH0ZvlvpKV7Yi96FrP8rDwWXaAD9",
  }
};
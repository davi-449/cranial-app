const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Certifique-se de que o ponto de entrada está correto
  if (!config.entry || typeof config.entry !== 'string') {
    config.entry = './AppEntry.js'; // Altere para o caminho correto do seu arquivo App.js ou App.tsx
  }

  return config;
};

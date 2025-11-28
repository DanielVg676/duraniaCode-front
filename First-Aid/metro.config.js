const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js']
};

// Agregamos las extensiones de los modelos de IA
config.resolver.assetExts.push(
  'gguf', // Para modelos Llama
  'bin'   // Para modelos Whisper
);

module.exports = withNativeWind(config, { input: './src/global.css' });
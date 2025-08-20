const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

const ALIASES = {
  "react-native-maps": "@teovilla/react-native-web-maps",
};

config.resolver.resolveRequest = ( context, moduleName, platform ) => {
  
  // web
  if (platform === 'web') {
    // call default resolver
    return context.resolveRequest(
      context,
      // use alias, if alias exists
      ALIASES[moduleName] ?? moduleName,
      platform
    );
  }
  
  // ios, android
  return context.resolveRequest(context, moduleName, platform);
  
};


module.exports = config;
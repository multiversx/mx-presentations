module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  comments: true,
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '~*': './src/*',
          animations: './src/animations',
          navigation: './src/navigation',
          assets: './src/assets',
          designSystem: './src/designSystem',
          hooks: './src/hooks',
          components: './src/components',
          containers: './src/containers',
          constants: './src/constants',
          nativeModules: './src/nativeModules',
          screens: './src/screens',
          services: './src/services',
          reduxStore: './src/reduxStore',
          types: './src/types',
          utils: './src/utils',
          __tests__: './src/__tests__'
        }
      }
    ]
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
};

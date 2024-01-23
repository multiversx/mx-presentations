import 'react-native-gesture-handler';
import 'node-libs-react-native/globals';
import React from 'react';
import Navigator from 'navigation/Navigator';
import { StatusBar } from 'react-native';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { palette } from 'designSystem/colors';
import { Provider } from 'react-redux';
import store, { persistor } from './src/reduxStore/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  const theme = createTheme({
    darkColors: palette,
    lightColors: palette,
    mode: 'dark',
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <StatusBar
            animated={true}
            backgroundColor={'transparent'}
            barStyle={'default'}
            showHideTransition={'fade'}
            hidden={false}
          />
          <Navigator />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;

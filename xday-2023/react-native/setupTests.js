/* eslint-disable no-undef */
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: global.mockedNavigate,
      dispatch: global.mockedDispatchNavigate,
      reset: global.mockedResetNavigate,
    }),
    useRoute: jest.fn(routeName => ({ name: routeName })),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn(),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: jest.fn(),
  };
});

jest.mock('@multiversx/sdk-wallet', () => {
  return {
    Mnemonic: {
      fromString: jest.fn(),
    },
    UserSigner: {},
  };
});

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: jest.fn(() => ({ top: 24 })),
  };
});

jest.mock('node-libs-react-native/globals', () => {
  return {};
});

//
// Mock AnimationFrame
//
global.requestAnimationFrame = callback => {
  if (callback) {
    callback();
  }
};

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from 'screens/LoginScreen';
import {
  WalletScreenRoute,
  TransactionStatusScreenRoute,
  SendTransactionScreenRoute,
  LoginScreenRoute
} from './routes';
import TransactionStatusScreen from 'screens/TransactionStatusScreen';
import { multiversxAddressSelector } from 'reduxStore/selectors/walletsSelectors';
import { useSelector } from 'react-redux';
import WalletScreen from 'screens/WalletScreen';
import SendTransactionScreen from 'screens/SendTransactionScreen';
import { NavigationStackParamsList } from './stackParamsList';

export const Stack = createNativeStackNavigator<NavigationStackParamsList>();

const Navigator: React.FC = () => {
  const multiversxAddress = useSelector(multiversxAddressSelector);
  const stackScreens = multiversxAddress ? (
    <>
      <Stack.Screen component={WalletScreen} name={WalletScreenRoute} />
      <Stack.Screen
        component={TransactionStatusScreen}
        name={TransactionStatusScreenRoute}
      />
      <Stack.Screen
        component={SendTransactionScreen}
        name={SendTransactionScreenRoute}
      />
    </>
  ) : (
    <Stack.Screen component={LoginScreen} name={LoginScreenRoute} />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}}>{stackScreens}</Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

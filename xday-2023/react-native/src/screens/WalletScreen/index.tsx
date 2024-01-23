import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SendTransactionScreenRoute } from 'navigation/routes';
import { ScreenWrapper } from 'components/ScreenWrapper';
import AccountDetails from './components/AccountDetails';
import Button from 'components/Button';
import TransactionList from './components/TransactionList';
import { useDispatch } from 'react-redux';
import { resetAction } from 'reduxStore/commonActions';
import { ScrollView } from 'react-native';

const WalletScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleNavigateToSignTransactionScreen = () => {
    navigation.navigate(SendTransactionScreenRoute);
  };
  const handleSignOut = () => {
    dispatch(resetAction());
  };
  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccountDetails />
        <Button
          label='Send crypto'
          onPress={handleNavigateToSignTransactionScreen}
        />
        <Button label='Sign out' onPress={handleSignOut} />

        <TransactionList />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default WalletScreen;

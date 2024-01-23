import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { prettifyBalance } from 'utils/index';
import useStyles from './AccountDetails.styles';
import { useSelector } from 'react-redux';
import { multiversxAddressSelector } from 'reduxStore/selectors/walletsSelectors';
import { useGetMultiversxAccountQuery } from 'reduxStore/apis/root.api';

const AccountDetails = () => {
  const multiversxAddress = useSelector(multiversxAddressSelector);
  const styles = useStyles();
  const {
    data: account,
    isLoading,
    error
  } = useGetMultiversxAccountQuery(multiversxAddress);
  const balanceContent = useMemo(() => {
    if (isLoading) {
      return <Text>Loading ...</Text>;
    }

    if (error) {
      return <Text>Something went wrong ...</Text>;
    }

    return (
      <>
        <Text style={styles.value}>
          {account
            ? `${prettifyBalance(account.balance)} XeGLD`
            : 'unknown balance'}
        </Text>
      </>
    );
  }, [isLoading, error]);

  return (
    <>
      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>
        {multiversxAddress || 'no address available'}
      </Text>
      <Text style={styles.label}>Balance:</Text>
      {balanceContent}
    </>
  );
};

export default AccountDetails;

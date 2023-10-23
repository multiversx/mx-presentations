import React, { useEffect, useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { TransactionWatcher } from '@multiversx/sdk-core';
import { BASE_URL_EXPLORER } from 'constants/network';
import useStyles from './TransactionStatusScreen.styles';
import Button, { BUTTON_VARIANTS } from 'components/Button';
import { ScreenWrapper } from 'components/ScreenWrapper';
import { TransactionServerStatusesEnum } from '@multiversx/sdk-dapp/types';
import { ApiNetworkProviderSingleton } from 'services/networkProvider';
import { getTransactionInfoByStatus } from './getTransactionInfoByStatus';
import { useGetMultiversxTransactionByHashQuery } from 'reduxStore/apis/root.api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';
import { DECIMALS } from '@multiversx/sdk-dapp/constants';
import { TransactionStatusRouteParamsType } from '../../navigation/stackParamsList';

const apiNetworkProvider = ApiNetworkProviderSingleton.getInstance();

const TransactionStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TransactionStatusRouteParamsType>();
  const styles = useStyles();
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionServerStatusesEnum>(
      TransactionServerStatusesEnum.notExecuted
    );
  const txHash = route.params?.txHash;
  const {
    data: transaction,
    isLoading,
    error
  } = useGetMultiversxTransactionByHashQuery(txHash);

  useEffect(() => {
    if (txHash) {
      //this will start a watcher on transaction hash
      //and the callback will be notified when the transaction is completed or has failed
      const handleCheckTransactionStatus = async () => {
        const watcher = new TransactionWatcher(apiNetworkProvider);
        try {
          const transactionOnNetwork = await watcher.awaitCompleted({
            getHash: () => ({ hex: () => txHash })
          });

          const isFailed = transactionOnNetwork.status.isFailed();
          const isExecuted = transactionOnNetwork.status.isExecuted();

          if (isFailed) {
            setTransactionStatus(TransactionServerStatusesEnum.fail);
          } else if (isExecuted) {
            setTransactionStatus(TransactionServerStatusesEnum.executed);
          }
        } catch (error) {
          console.log('[ transactionOnNetworkCompleted ] ERROR:', error);
          setTransactionStatus(TransactionServerStatusesEnum.fail);
        }
      };
      handleCheckTransactionStatus();
    }
  }, [txHash]);

  const handlePressBack = () => {
    if (navigation.canGoBack()) {
      navigation.popToTop();
    }
  };

  const handlePressOpenExplorer = async () => {
    const websiteUrl = `${BASE_URL_EXPLORER}/${txHash}`;

    const supported = await Linking.canOpenURL(websiteUrl);
    if (supported) {
      await Linking.openURL(websiteUrl);
    } else {
      console.error('Cannot open URL:', websiteUrl);
    }
  };

  const statusInfo = getTransactionInfoByStatus(transactionStatus);
  const getContent = () => {
    if (isLoading || transaction == null) {
      return <Text>Loading ...</Text>;
    }
    if (error) {
      return <Text>Something went wrong ...</Text>;
    }
    const formattedAmount = formatAmount({
      input: transaction.value,
      decimals: DECIMALS
    });
    return (
      <>
        <View>
          <Text style={styles.checkMark}>{statusInfo.icon}</Text>

          <Text style={[styles.label, { color: statusInfo.color }]}>
            {statusInfo.title}
          </Text>
        </View>
        <View>
          <View style={styles.rowWrapper}>
            <Text style={styles.label}>Amount: </Text>
            <Text style={styles.amount}>{formattedAmount} XeGLD</Text>
          </View>
          <View style={styles.rowWrapper}>
            <Text style={styles.label}>Receiver: </Text>
            <Text style={styles.value}>{transaction.receiver}</Text>
          </View>
          <View style={styles.rowWrapper}>
            <Text style={styles.label}>TX hash:</Text>
            <Text style={styles.value}>{txHash}</Text>
          </View>
        </View>
        <View>
          <Button
            label='View in explorer'
            variant={BUTTON_VARIANTS.LINK}
            onPress={handlePressOpenExplorer}
          />
          <Button label='Back to wallet' onPress={handlePressBack} />
        </View>
      </>
    );
  };

  return <ScreenWrapper><View style={styles.wrapper}>{getContent()}</View></ScreenWrapper>;
};

export default TransactionStatusScreen;

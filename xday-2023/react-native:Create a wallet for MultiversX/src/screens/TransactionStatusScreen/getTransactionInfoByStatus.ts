import { TransactionServerStatusesEnum } from '@multiversx/sdk-dapp/types';
import { palette } from 'designSystem/colors';

export const getTransactionInfoByStatus = (
  txStatus: TransactionServerStatusesEnum
) => {
  switch (txStatus) {
    case TransactionServerStatusesEnum.executed:
      return {
        icon: '✅',
        title: 'Transaction successfully sent',
        color: palette.green
      };
    case TransactionServerStatusesEnum.fail:
      return {
        icon: '❗️',
        title: 'Failed to send transaction',
        color: palette.red
      };

    // defaults to TX_STATUS.PENDING state
    default:
      return {
        icon: '📤',
        title: 'Transaction pending',
        color: palette.orange
      };
  }
};

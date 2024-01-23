import { IPlainTransactionObject } from '@multiversx/sdk-core';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import {GAS_LIMIT, GAS_PER_DATA_BYTE, GAS_PRICE} from '@multiversx/sdk-dapp/constants';
import WalletManager from '../nativeModules/WalletManager';
import { chainIds } from 'constants/network';

interface GenerateSignedMultiversxTransactionPropsType {
  amount: string | number;
  receiver: string ;
  data?: string;
  sender: string;
  nonce: number;
}

export async function generateSignedMultiversxTransactions({
  amount,
  receiver,
  sender,
  nonce,
  data = '',
}: GenerateSignedMultiversxTransactionPropsType): Promise<IPlainTransactionObject> {
  const dataGasLimit = data?.length * GAS_PER_DATA_BYTE;

  const totalGasLimit = Number(GAS_LIMIT) + dataGasLimit;
  const transactionsToSign = {
    amount: parseAmount(String(amount)),
    receiver,
    gasPrice: String(GAS_PRICE),
    gasLimit: String(totalGasLimit),
    sender,
    nonce,
    data,
    chainId: chainIds.devnet
  };

  const signedTransactionJSON = await WalletManager.signTransaction(
    transactionsToSign
  );
  return JSON.parse(signedTransactionJSON);
}

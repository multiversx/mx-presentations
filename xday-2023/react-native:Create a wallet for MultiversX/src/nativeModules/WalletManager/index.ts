import { NativeModules } from 'react-native';

import { SignTransactionInput, WalletType } from 'types/wallet';

const { WalletManager } = NativeModules;

interface WalletManagerInterface {
  generateNewWallet(name: string): Promise<WalletType>;

  importWallet(mnemonic: string, name: string): Promise<WalletType>;

  signTransaction(transaction: SignTransactionInput): Promise<string>;

  removeWallet(identifier: string): Promise<void>;

  removeAllWallets(): Promise<void>;

  signMessage(message: string): Promise<string>;

  getSecretPhrase(): Promise<string>;
}

export default WalletManager as WalletManagerInterface;

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'reduxStore/store';
import { WalletChainsEnum } from 'types/wallet';

const walletsInfoSelector = (state: RootState) => state.wallets;

export const activeWalletSelector = createSelector(
  walletsInfoSelector,
  (state) => state.activeWallet
);

export const multiversxAccountSelector = createSelector(
  activeWalletSelector,
  (activeWallet) => {
    return activeWallet?.accounts.find(
      (account) => account?.coin === WalletChainsEnum.multiversx
    );
  }
);

export const multiversxAddressSelector = createSelector(
  multiversxAccountSelector,
  (wallet) => {
    return wallet?.address ?? '';
  }
);

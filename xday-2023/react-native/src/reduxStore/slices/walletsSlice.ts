import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resetAction } from 'reduxStore/commonActions';

import { WalletType } from 'types/wallet';

export interface WalletsSliceType {
  wallets: WalletType[];
  activeWallet: WalletType | null;
}

const initialState: WalletsSliceType = {
  wallets: [],
  activeWallet: null
};

export const walletsSlice = createSlice({
  name: 'walletsSlice',
  initialState: initialState,
  reducers: {
    setActiveWallet: (
      state: WalletsSliceType,
      action: PayloadAction<WalletType | null>
    ) => {
      state.activeWallet = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAction, () => {
      return initialState;
    });
  }
});

export const { setActiveWallet } = walletsSlice.actions;

export default walletsSlice.reducer;

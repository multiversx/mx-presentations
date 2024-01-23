import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { MNEMONICS_MOCK } from 'constants/mnemonic-words-mock';
import useStyles from './LoginScreen.styles';
import { useAsyncAction } from 'hooks/utils/useAsyncAction';
import Button, { BUTTON_VARIANTS } from 'components/Button';
import { extractMnemonicFromString } from 'utils';
import { ScreenWrapper } from 'components/ScreenWrapper';
import { setActiveWallet } from 'reduxStore/slices/walletsSlice';
import { useDispatch } from 'react-redux';
import WalletManager from 'nativeModules/WalletManager';

const walletName = 'myFirstWallet';
export const LoginScreen = () => {
  const { error, isLoading, onTriggerAction } = useAsyncAction();
  const styles = useStyles();
  const dispatch = useDispatch();

  const [mnemonics, setMnemonics] = useState('');

  const handleImportWallet = async () => {
    await onTriggerAction(async () => {
      const mnemonicStr = extractMnemonicFromString(mnemonics);
      const wallet = await WalletManager.importWallet(mnemonicStr, walletName);
      dispatch(setActiveWallet(wallet));
    });
  };

  const handleCreateWallet = async () => {
    await onTriggerAction(async () => {
      await WalletManager.generateNewWallet(walletName);
    });
  };
  const handleMock = () => setMnemonics(MNEMONICS_MOCK);
  const handleReset = () => setMnemonics('');

  const resetButtonsContent = isLoading ? (
    <Text>Connecting wallet ...</Text>
  ) : (
    <View style={styles.buttonsWrapper}>
      <Button
        disabled={isLoading}
        variant={BUTTON_VARIANTS.OUTLINED}
        label='Add mock words'
        onPress={handleMock}
      />
      <Button
        disabled={isLoading}
        variant={BUTTON_VARIANTS.LINK}
        label='Reset data'
        onPress={handleReset}
      />
    </View>
  );

  const buttonsContent = (
    <View>
      <Button
        disabled={isLoading}
        label='Import wallet from mnemonics'
        onPress={handleImportWallet}
      />
      <Button
        disabled={isLoading}
        label='Create new wallet'
        onPress={handleCreateWallet}
      />
      {resetButtonsContent}
    </View>
  );

  return (
    <ScreenWrapper>
      <View >
        <Text>Enter the mnemonics</Text>
        <TextInput
          numberOfLines={24}
          multiline
          style={styles.mnemonicInput}
          onChangeText={setMnemonics}
          value={mnemonics}
          placeholder='moral volcano peasant ...'
        />
      </View>
      <View>
        {error != null ? (
          <Text style={styles.errorMessage}>Invalid mnemonics</Text>
        ) : null}
        {buttonsContent}
      </View>
    </ScreenWrapper>
  );
};

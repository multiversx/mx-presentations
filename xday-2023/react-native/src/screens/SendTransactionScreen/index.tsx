import React, { useRef } from 'react';
import * as Yup from 'yup';
import { Text, TextInput } from 'react-native';
import { ScreenWrapper } from 'components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useAsyncAction } from 'hooks/utils/useAsyncAction';
import useStyles from './SendTransactionScreen.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useSendMultiversxTransactionMutation,
  useLazyGetMultiversxAccountQuery
} from 'reduxStore/apis/root.api';
import Button from 'components/Button';
import { TransactionStatusScreenRoute } from 'navigation/routes';
import { View } from 'react-native';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { multiversxAddressSelector } from 'reduxStore/selectors/walletsSelectors';
import { generateSignedMultiversxTransactions } from 'utils/generateSignedMultiversxTransaction';

const fields = {
  receiver: 'receiver',
  amount: 'amount',
  data: 'data'
};

const validationSchema = Yup.object().shape({
  [fields.receiver]: Yup.string().required('Required'),
  [fields.amount]: Yup.number().required('Required')
});

const SendTransactionScreen = () => {
  const navigation = useNavigation();
  const styles = useStyles();
  const multiversxAddress = useSelector(multiversxAddressSelector);
  const { isLoading, error, onTriggerAction } = useAsyncAction();

  const [getMultiversxAccount] = useLazyGetMultiversxAccountQuery();
  const [sendTransaction] = useSendMultiversxTransactionMutation();
  const amountRef = useRef<TextInput>(null);

  const { values, errors, setFieldValue } = useFormik({
    initialValues: {
      [fields.receiver]: '',
      [fields.amount]: 0,
      [fields.data]: ''
    },
    validateOnChange: true,
    validateOnMount: false,
    validationSchema,
    onSubmit: handleSend
  });
  async function handleSend() {
    onTriggerAction(async () => {
      const multiversxAccount = await getMultiversxAccount(
        multiversxAddress
      ).unwrap();
      //TODO check if receiver address is valid before trying to send the transaction
      const signedTransaction = await generateSignedMultiversxTransactions({
        amount: values.amount,
        receiver: values.receiver,
        data: values.data,
        sender: multiversxAddress,
        nonce: multiversxAccount?.nonce ?? 1
      });
      const { txHash } = await sendTransaction(signedTransaction).unwrap();
      if (txHash == null) {
        throw new Error('could not send transaction');
      }
      navigation.navigate(TransactionStatusScreenRoute, { txHash });
    });
  }

  const handleFieldChange = (fieldName: string) => (value: string) => {
    setFieldValue(fieldName, value);
  };

  const hasErrors = Object.values(errors).length > 0;

  const receiverError = errors[fields.receiver];
  const amountError = errors[fields.amount];

  return (
    <ScreenWrapper>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentWrapper}>
        <View>
          <Text>Send eGLD securely</Text>
          <View>
            <Text style={styles.label}>To:</Text>
            <TextInput
              style={styles.input}
              placeholder='Recipient address'
              value={values.receiver as string}
              onChangeText={handleFieldChange(fields.receiver)}
              returnKeyType='next'
            />
            {receiverError && (
              <Text style={styles.errorMessage}>{receiverError}</Text>
            )}
          </View>

          <View>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              ref={amountRef}
              style={styles.input}
              placeholder='Amount'
              value={String(values.amount)}
              onChangeText={handleFieldChange(fields.amount)}
              keyboardType='numeric'
            />
            {amountError && (
              <Text style={styles.errorMessage}>{amountError}</Text>
            )}
          </View>
          <View>
            <Text style={styles.label}>Data:</Text>
            <TextInput
              style={styles.input}
              placeholder='Data'
              value={values.data as string}
              onChangeText={handleFieldChange(fields.data)}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          {error ? (
            <Text style={styles.errorMessage}>
              Something went wrong, please try again
            </Text>
          ) : null}
          <Button
            disabled={hasErrors || isLoading}
            label='Send transaction'
            onPress={handleSend}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};
export default SendTransactionScreen;

import {
  LoginScreenRoute,
  SendTransactionScreenRoute,
  TransactionStatusScreenRoute,
  WalletScreenRoute
} from './routes';
import { RouteProp } from '@react-navigation/native';

export interface TransactionStatusScreenRouteParamsType {
  txHash: string;
}

export type TransactionStatusRouteParamsType = RouteProp<
  Record<string, TransactionStatusScreenRouteParamsType>,
  string
>;

export type NavigationStackParamsList = {
  [WalletScreenRoute]: undefined;
  [TransactionStatusScreenRoute]: TransactionStatusScreenRouteParamsType;
  [SendTransactionScreenRoute]: undefined;
  [LoginScreenRoute]: undefined;
};

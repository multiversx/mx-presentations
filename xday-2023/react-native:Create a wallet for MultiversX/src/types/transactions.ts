import { IPlainTransactionObject } from '@multiversx/sdk-core/out';

export interface ExpandedTransactionType extends IPlainTransactionObject {
  txHash: string;
}

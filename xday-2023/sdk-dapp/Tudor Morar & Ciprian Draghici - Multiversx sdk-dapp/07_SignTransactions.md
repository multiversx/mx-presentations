# 7. Sign Transactions

One of the critical aspects of the blockchain technology is the signing transactions process.
In the world of blockchain technology, the authenticity and validity of a transaction are contingent upon its proper signing.
Without a valid signature, the blockchain will not accept or process the transaction.
To simplify and streamline this crucial operation, the `@multiversx/sdk-dapp` library offers a comprehensive solution, including the ability to sign transactions efficiently.

At the heart of this process is the `signTransactions` function provided by the `@multiversx/sdk-dapp` library.
Additionally, you can also employ the `sendTransactions` function, as detailed later in this document.
The `signTransactions` function simplifies the signing of one or more transactions simultaneously, providing a seamless experience for developers.

To initiate the signing process, you need to provide a set of parameters to the `signTransactions` function:

```typescript
export interface SignTransactionsPropsType {
  transactions: Transaction[] | Transaction;
  minGasLimit?: number;
  callbackRoute?: string;
  transactionsDisplayInfo: TransactionsDisplayInfoType;
  customTransactionInformation: CustomTransactionInformation;
}
```

`transactions`: This parameter represents either a single transaction object or an array of transaction objects that adhere to the Transaction interface from the `@multiversx/sdk-core` library.
`minGasLimit`: An optional parameter that specifies the minimum amount of gas required for transaction processing. During the signing step, this value is used solely for computing transaction fees with a default value of 50,000.
`callbackRoute`: An optional route to redirect to after the signing process is completed successfully.
`transactionDisplayInfo`: This parameter contains essential fields used by the transaction toast to display relevant information, including error messages, success messages, processing messages, and more.
```typescript
export interface TransactionsDisplayInfoType {
  errorMessage?: string;
  successMessage?: string;
  processingMessage?: string;
  submittedMessage?: string;
  transactionDuration?: number;
  timedOutMessage?: string;
  invalidMessage?: string;
}
```
`customTransactionInformation`: This object stores information related to the transaction execution process but isn't directly relevant to the transactions themselves. It includes options such as redirecting after signing, session information, transaction completion delay, signing without sending, and more.
```typescript
export interface CustomTransactionInformation {
  /**
   * If true, redirects to the provided callbackRoute
   */
  redirectAfterSign: boolean;
  /**
   * Can contain any kind of information for the current signing session
   */
  sessionInformation: any;
  /**
  * Delay the transaction status from going into "successful" state
  */
  completedTransactionsDelay?: number;
  /**
  * The transactions will be signed without being sent to the blockchain
  */
  signWithoutSending: boolean;
  /**
   * If true, the change guardian action will not trigger the transaction version update
   */
  skipGuardian?: boolean;
}
```


## How to Use the `signTransactions` function ?

Here's an example of how to utilize the `signTransactions` function:

```typescript
import { signTransactions } from "@multiversx/sdk-dapp/services/transactions/signTransactions";

const { sessionId } = await signTransactions({
    transactions: [
        {
          value: '1000000000000000000',
          data: 'ping',
          receiver: contractAddress
        },
      ],
    callbackRoute: "/home",
    transactionsDisplayInfo: {
      processingMessage: "Processing…"
    },
    customTransactionInformation: {
      redirectAfterSign: true,
      signWithoutSending: true
    }	
});
```

**Important note! To ensure transactions are successfully signed, you must either use the `<SignTransactionsModals />` component mounted under `<DappProvider ... />` or the `useSignTransactions` hook, as described below. Transactions will not be signed without one of these components in place.**

```jsx
<DappProvider
   environment="devnet"
>
  <SignTransactionsModals />
  {...your dapp content}
</DappProvider>
```

## The `useSignTransactions` hook

For developers who prefer not to use the default modals that appear during the signing process, the `useSignTransactions` hook offers a flexible alternative. 
This hook provides you with detailed information about transactions, error handling, and the ability to programmatically abort the signing process.

You can also use it to display relevant messages to users based on the provider type.

```typescript
const {
  callbackRoute,
  transactions,
  error,
  sessionId,
  onAbort,
  hasTransactions,
  canceledTransactionsMessage
} = useSignTransactions();
```


## An alternative: `sendTransactions` function

Another way to sign transactions is by using the `sendTransactions` function. 
You can specify the `signWithoutSending` parameter as true to sign transactions without immediately sending them to the blockchain. 
This can be useful when you want to send transactions at a later time or implement custom logic around transaction signing.

```typescript
export interface SendTransactionsPropsType {
    /**
     * Accepts a single transaction or an array of transactions to be sent to the blockchain or signed without sending to the blockchain (signWithoutSending = true).
     */
    transactions:
        | Transaction
        | SimpleTransactionType
        | (Transaction | SimpleTransactionType)[];
    /**
     * If true, redirects to the provided callbackRoute
     */
    redirectAfterSign?: boolean;
    /**
     * The transactions will be signed without being sent to the blockchain
     */
    signWithoutSending: boolean;
    /**
     * Allow changeGuardian transaction for guarded accounts
     */
    skipGuardian?: boolean;
    /**
     * Delay the transaction status from going into "successful" state
     */
    completedTransactionsDelay?: number;
    /**
     * The route to be redirected to after signing. Will not redirect if the user is already on the specified route
     * @default window.location.pathname
     */
    callbackRoute?: string;
    /**
     * Custom message for toasts texts
     * @default null
     */
    transactionsDisplayInfo: TransactionsDisplayInfoType;
    /**
     * Minimum amount of gas in order to process the transaction.
     * @default 50_000
     */
    minGasLimit?: number;
    /**
     * Contains extra sessionInformation that will be passed back via getSignedTransactions hook
     */
    sessionInformation?: any;
}


const { sessionId, error } = await sendTransactions({
    transactions: [
        {
          value: '1000000000000000000',
          data: 'ping',
          receiver: contractAddress
        },
      ],
    signWithoutSending: true,
    callbackRoute: window.location.pathname,
    redirectAfterSign: true
});
```

It returns a Promise that will be fulfilled with `{error?: string; sessionId: string | null;}`

`sessionId` is the transaction's batch id which can be used to track a transaction's status and react to it.
`error` is the error that can appear during the signing/sending process.


## Bonus: Signing Batch Transactions

To sign a batch of transactions without sending them to the blockchain, you can set the `signWithoutSending` parameter as true when using the `sendBatchTransactions` function.
This allows for flexible handling of transaction batches, making it easier to manage and execute multiple transactions in a single batch.

```typescript
const { batchId, error } = await sendBatchTransactions({
    transactions: [
      [
        {
          value: '1000000000000000000',
          data: 'tx1',
          receiver: receiverAddress
        },
      ],
      [
        {
          value: '1000000000000000000',
          data: 'tx2',
          receiver: receiverAddress
        },
        {
          value: '1000000000000000000',
          data: 'tx3',
          receiver: receiverAddress
        },
      ]
    ],
    signWithoutSending: true,
    callbackRoute: window.location.pathname,
    redirectAfterSign: true
});
```

It returns a Promise that will be fulfilled with `{error?: string; batchId: string | null;}`

- `batchId` is the transactions' batch id used to send the batch to the batch service and to track the transactions status and react to it. This is composed by the `sessionId` (received after signing) and the user address. Eg. `12123423123-erd1address...`.
- `error` is the error that can appear during the signing/sending process.

The transactions will be signed without being sent to the blockchain. This is useful when you want to send the transactions to the blockchain at a later time or to implement a custom logic around.
To get the transactions that were signed, you can use the `useGetSignedTransactions` hook and search for the session id extracted from the batch id.

eg.

```typescript
const { signedTransactions } = useGetSignedTransactions();

const sessionId = batchId.split('-')[0];

const transactions = signedTransactions[sessionId]?.transactions;
```

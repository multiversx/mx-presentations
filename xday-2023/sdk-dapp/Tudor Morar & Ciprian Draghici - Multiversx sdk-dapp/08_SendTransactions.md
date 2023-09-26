# 8. Sending Transactions

In the realm of blockchain operations, the MultiversX ecosystem shines with its intuitive and efficient methods for sending transactions and keeping a watchful eye on their status. 
We explore this pivotal functionality offered by the `@multiversx/sdk-dapp` library, which streamlines the process of sending transactions and tracking their progress, complemented by a set of user-friendly UI components.

The API for sending transactions is a function called **sendTransactions**:

`import { sendTransactions } from "@multiversx/sdk-dapp/services/transactions/sendTransactions";`

This function simplifies the transaction-sending process, requiring only a minimal set of information to get started. 
Here's how you can use it:

```typescript
const { sessionId, error } = await sendTransactions({
    transactions: [
        {
          value: '1000000000000000000',
          data: 'ping',
          receiver: contractAddress
        },
      ],
    callbackRoute: window.location.pathname,
    redirectAfterSign: true
});
```

It returns a Promise, which will be fulfilled with `{error?: string; sessionId: string | null;}`

`sessionId` This is the session ID of the transaction, which can be used to track the transaction's status and respond accordingly
`error` In case an error occurs during the signing or sending process, this field will provide information about the error.

**Important note: To ensure that transactions are signed successfully, you must utilize either the `SignTransactionsModals` component mentioned in the [SignTransactionsSection](./07_SignTransactions.md) section or the `useSignTransactions` hook, as explained later in this document. 
Transactions will not be signed without one of these components in place.**

### Sending Transactions Synchronously in Batches

For those scenarios where you need to send multiple transactions in a synchronized manner, we provide the `sendBatchTransactions` function:

`import { sendBatchTransactions } from "@multiversx/sdk-dapp/services/transactions/sendBatchTransactions";`

This function enables you to sign and send a group of transactions that can be synchronized.
Here's a simplified example:

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
    callbackRoute: window.location.pathname,
    redirectAfterSign: true
```

Much like the `sendTransactions` function, it also returns a Promise, which can be fulfilled with `{error?: string; batchId: string | null;}`

- `batchId` This is the batch ID assigned to the group of transactions, allowing you to manage and track their status collectively. This is composed by the `sessionId` (received after signing) and the user address. Eg. `12123423123-erd1address...`.
- `error` As with the previous function, this field informs you of any potential errors encountered during the signing or sending process.

### Synchronizing Transactions

To ensure transactions are sent in a specific order, `sendBatchTransactions` accepts an argument called `transactions`, which is an array of transaction arrays. 
Transactions within each group are sent sequentially, but transactions in different groups will be sent in parallel.

Having the example above, the transactions will be sent in the following order:
- `tx1`
- `tx2, tx3`

`tx1` will be sent first, waits until is completed, then `tx2` and `tx3` will be sent in parallel.

** Important Note: This function sends transactions automatically in batches based on the provided array, immediately after signing. 
If you prefer to send them on demand or implement custom logic around sending, you should use the send callback exposed by the `useSendBatchTransactions` hook. 
Remember to save the `sessionId` passed to the batch. Our recommendation is to generate a new `sessionId` like this: `Date.now().toString();`. **

```typescript
import { sendBatchTransactions } from '@multiversx/sdk-dapp/services/transactions/sendBatchTransactions';
import { useSendBatchTransactions } from '@multiversx/sdk-dapp/hooks/transactions/batch/useSendBatchTransactions';


const { send: sendBatchToBlockchain } = useSendBatchTransactions();

// Use signWithoutSending: true to sign the transactions without sending them to the blockchain
sendBatchTransactions({
  transactions,
  signWithoutSending: true,
  callbackRoute: window.location.pathname,
  customTransactionInformation: { redirectAfterSign: true }
});

// After signing, you can send the transactions to the blockchain by using the send callback
const { error, batchId, data } = await sendBatchToBlockchain({
  transactions: signedTransactions, // array of arrays of signed transactions
  sessionId
});
```
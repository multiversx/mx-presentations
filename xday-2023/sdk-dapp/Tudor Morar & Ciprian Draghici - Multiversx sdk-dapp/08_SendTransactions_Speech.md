# 8. Sending Transactions Speech

In the realm of blockchain operations, the MultiversX ecosystem shines with its intuitive and efficient methods for sending transactions and keeping a watchful eye on their status.
We explore this pivotal functionality offered by the `@multiversx/sdk-dapp` library, which streamlines the process of sending transactions and tracking their progress, complemented by a set of user-friendly UI components.

The API for sending transactions is a function called **sendTransactions**.
This function simplifies the transaction-sending process, requiring only a minimal set of information to get started.


For those scenarios where you need to send multiple transactions in a synchronized manner, we provide the `sendBatchTransactions` function.
This function enables you to sign and send a group of transactions that can be synchronized.

To ensure transactions are sent in a specific order, `sendBatchTransactions` accepts an argument called `transactions`, which is an array of transaction arrays.
Transactions within each group are sent sequentially, but transactions in different groups will be sent in parallel.


Having the example:

```typescript
const transactions = [
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
    ]
```

the transactions will be sent in the following order:

- `tx1`
- `tx2, tx3`

`tx1` will be sent first, waits until is completed, then `tx2` and `tx3` will be sent in parallel.


In summary, the MultiversX ecosystem simplifies the process of sending and tracking transactions, making blockchain operations more accessible to developers. 
Whether you choose to use the `sendTransactions` function, the `sendBatchTransactions` function, or opt for custom transaction handling, we ensure that your transactions are handled securely and efficiently.

Thank you for joining us as we explore this integral aspect of blockchain functionality.
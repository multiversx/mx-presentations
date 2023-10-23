# 7. Sign Transactions Speech

Today, we delve into a critical aspect of blockchain transactions: the signing process. 
In the world of blockchain technology, the authenticity and validity of a transaction are contingent upon its proper signing. 
Without a valid signature, the blockchain will not accept or process the transaction. 
To simplify and streamline this crucial operation, the `@multiversx/sdk-dapp` library offers a comprehensive solution, including the ability to sign transactions efficiently.


## Signing Transactions with Ease

At the heart of this process is the `signTransactions` function provided by the `@multiversx/sdk-dapp` library.
Additionally, you can also employ the `sendTransactions` function, as detailed later in this document. 
The `signTransactions` function simplifies the signing of one or more transactions simultaneously, providing a seamless experience for developers.

To initiate the signing process, you need to provide a set of parameters to the `signTransactions` function:

`transactions`: This parameter represents either a single transaction object or an array of transaction objects that adhere to the Transaction interface from the `@multiversx/sdk-core` library.
`minGasLimit`: An optional parameter that specifies the minimum amount of gas required for transaction processing. During the signing step, this value is used solely for computing transaction fees with a default value of 50,000.
`transactionDisplayInfo`: This parameter contains essential fields used by the transaction toast to display relevant information, including error messages, success messages, processing messages, and more.
`callbackRoute`: An optional route to redirect to after the signing process is completed successfully.
`customTransactionInformation`: This object stores information related to the transaction execution process but isn't directly relevant to the transactions themselves. It includes options such as redirecting after signing, session information, transaction completion delay, signing without sending, and more.


For developers who prefer not to use the default modals that appear during the signing process, the `useSignTransactions` hook offers a flexible alternative.
This hook provides you with detailed information about transactions, error handling, and the ability to programmatically abort the signing process.
You can also use it to display relevant messages to users based on the provider type.

Another way to sign transactions is by using the `sendTransactions` function.
You can specify the `signWithoutSending` parameter as true to sign transactions without immediately sending them to the blockchain.
This can be useful when you want to send transactions at a later time or implement custom logic around transaction signing.



## Bonus: Signing Batch Transactions

To sign a batch of transactions without sending them to the blockchain, you can set the `signWithoutSending` parameter as true when using the `sendBatchTransactions` function.
This allows for flexible handling of transaction batches, making it easier to manage and execute multiple transactions in a single batch.




In conclusion, signing transactions is a pivotal step in blockchain operations, and the `@multiversx/sdk-dapp` library simplifies this process significantly.
Whether you choose to use the `signTransactions` function, the `useSignTransactions` hook, or the alternative sendTransactions function,
you'll find that signing transactions on the MultiversX blockchain has never been more straightforward.

Thank you for joining us on this journey through the world of blockchain transaction signing!
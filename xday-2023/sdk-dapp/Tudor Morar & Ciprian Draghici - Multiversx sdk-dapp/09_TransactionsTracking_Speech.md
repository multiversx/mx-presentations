# 9. Transactions Tracking Speech

In the realm of blockchain operations, tracking transactions is an essential aspect of ensuring the smooth execution of blockchain activities.
In the MultiversX ecosystem, we provide a built-in implementation for tracking transactions, whether they are sent individually or synchronized through batch transactions.

To make transaction tracking effortless, we've introduced the `TransactionTracker` component, which is seamlessly integrated into the `DappProvider` component by default.
Behind the scenes, it leverages the power of two hooks: `useTransactionsTracker` for tracking normal transactions and `useBatchTransactionsTracker` for tracking batch transactions.

`useTransactionsTracker` - This hook enables developers to track transactions sent individually.
`useBatchTransactionsTracker` Designed specifically for tracking batch transactions, this hook ensures you can monitor groups of transactions with ease.

Furthermore, the same props can be passed to the `TransactionTracker` component, providing a consistent approach to tracking transactions throughout your application.

These props allow developers to define callbacks for handling successful transactions (`onSuccess`) and failed transactions (`onFail`).
This flexibility ensures that you can customize your transaction tracking experience to meet your specific needs.

Developers also have the flexibility to craft their own custom transaction tracking component, using these hooks or by implementing their unique logic.
This custom component can then be seamlessly integrated into the `DappProvider` component through the `customComponents` field, allowing for a tailored transaction tracking experience.


As transactions progress, the transaction trackers will automatically update the transaction statuses in the store. 
This functionality is integral to the `TransactionToastList` component, which is responsible for displaying transaction statuses in a user-friendly manner.


In conclusion, the built-in transaction tracking features and flexible customization options ensure that tracking transactions on the MultiversX blockchain is a seamless experience. Whether you choose to use the default implementation or create a tailored tracking component, rest assured that your transactions will be monitored with precision and efficiency.

Thank you for joining us on this exploration of transaction tracking within the MultiversX ecosystem.
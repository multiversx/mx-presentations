# 9. Transactions Tracking

In the realm of blockchain operations, tracking transactions is an essential aspect of ensuring the smooth execution of blockchain activities.
In the MultiversX ecosystem, we provide a built-in implementation for tracking transactions, whether they are sent individually or synchronized through batch transactions.
We will delve into this crucial functionality and explore the tools we offer for seamless transaction tracking.


## Built-In Transaction Tracking

To make transaction tracking effortless, we've introduced the `TransactionTracker` component, which is seamlessly integrated into the `DappProvider` component by default. 
Behind the scenes, it leverages the power of two hooks: `useTransactionsTracker` for tracking normal transactions and `useBatchTransactionsTracker` for tracking batch transactions.

`useTransactionsTracker` - This hook enables developers to track transactions sent individually. 
`useBatchTransactionsTracker` Designed specifically for tracking batch transactions, this hook ensures you can monitor groups of transactions with ease.

These hooks has the following props:
```typescript
export interface TransactionsTrackerType {
  getTransactionsByHash?: GetTransactionsByHashesType;
  onSuccess?: (sessionId: string | null) => void;
  onFail?: (sessionId: string | null, errorMessage?: string) => void;
}
```
Furthermore, the same props can be passed to the `TransactionTracker` component, providing a consistent approach to tracking transactions throughout your application.

These props allow developers to define callbacks for handling successful transactions (`onSuccess`) and failed transactions (`onFail`). 
This flexibility ensures that you can customize your transaction tracking experience to meet your specific needs.

Developers also have the flexibility to craft their own custom transaction tracking component, using these hooks or by implementing their unique logic. 
This custom component can then be seamlessly integrated into the `DappProvider` component through the `customComponents` field, allowing for a tailored transaction tracking experience.

```jsx
import { TransactionsTracker } from "your/module";

<DappProvider
  environment={environment}
  customNetworkConfig={{
    name: 'customConfig',
    apiTimeout,
    walletConnectV2ProjectId
  }}
  customComponents={{
    transactionTracker: {
      // If the component is not passed, the default one is used
      component: TransactionsTracker,
      props: {
        onSuccess: (sessionId) => {
            console.log(`Session ${sessionId} successfully completed`);
        },
        onFail: (sessionId, errorMessage) => {
            console.log(`Session ${sessionId} failed, ${errorMessage}`);
        }
      }
    }
  }}
>
````


## Transaction Tracking in Action

This could be a good starting point for creating a custom transaction tracker component.

```typescript
import { useBatchTransactionsTracker } from 'hooks/transactions/batch/tracker/useBatchTransactionsTracker';
import { useTransactionsTracker } from 'hooks/transactions/useTransactionsTracker';

const props = {
  onSuccess: (sessionId) => {
    console.log(`Session ${sessionId} successfully completed`);
  },
  onFail: (sessionId, errorMessage) => {
    console.log(`Session ${sessionId} failed, ${errorMessage}`);
  }
};

useTransactionsTracker(props);
useBatchTransactionsTracker(props);
```

As transactions progress, the transaction trackers will automatically update the transaction statuses in the store. This functionality is integral to the `TransactionToastList` component, which is responsible for displaying transaction statuses in a user-friendly manner.
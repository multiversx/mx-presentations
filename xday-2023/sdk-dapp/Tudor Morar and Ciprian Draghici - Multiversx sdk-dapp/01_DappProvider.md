# 1. DappProvider

The fundamental component in the world of decentralized applications or dApps on MultiversX blockchain is known as DappProvider. 
This component plays a pivotal role in setting up the foundation for your dApp, enabling seamless interactions with the blockchain network, and ensuring that your users have a smooth and secure experience.

At its core, the DappProvider serves two crucial functions. 
Firstly, it orchestrates the setup of a Redux store, where all essential details required by your dApp, such as login state, transaction status, and more, are stored.
Secondly, it takes care of initializing your dApp, ensuring that it's ready to interact with the blockchain.

The DappProvider component accepts several properties, with some of them being mandatory. Let's explore these properties:

```typescript
export interface DappProviderPropsType {
  children: React.ReactNode | ReactElement;
  customNetworkConfig?: CustomNetworkType;
  externalProvider?: IDappProvider;
  environment: 'testnet' | 'mainnet' | 'devnet';
  customComponents?: CustomComponentsType;
  dappConfig?: DappConfigType;
}
```

`children`: This is a mandatory property and represents the content of your dApp. It should encapsulate your entire application since it will be rendered only after the dApp has been successfully initialized.

`customNetworkConfig`: An optional property that allows you to configure your network settings, such as API endpoints and gas limits, for custom blockchain networks.
The `customNetworkConfig` object allows you to configure your network with different APIs and connection providers. This is particularly useful when building custom networks, giving you granular control over network details.

`externalProvider`: Another optional property, this one lets you use your own wallet provider implementation, offering flexibility in how users interact with your dApp.
The `externalProvider` property allows you to use your own wallet provider implementation, such as an extension provider or web wallet provider, adding flexibility to how users access your dApp.

`environment`: This is a mandatory key that specifies the environment in which your dApp operates, determining the endpoints and configurations for that environment. Accepted values are `testnet`, `devnet`, and `mainnet`.

`customComponents`: Yet another optional property, this one empowers developers to use their own implementations for transactions sender and tracker components.
With the `customComponents` property, developers can implement their own transaction sender and tracker components, providing a tailored experience for their users.

`dappConfig`: An optional property that allows for custom configurations, including specifying the logout route and deciding whether to use a web view provider.

## How to use the DappProvider ?

To incorporate the DappProvider into your React project, simply wrap your app content with it, as shown in this example:


```jsx
<DappProvider
   environment="devnet"
   customNetworkConfig={customNetworkConfig} // optional
   dappConfig={dappConfig} // optional
>
  {...your dapp content}
</DappProvider>
```


### Extra: Batch transactions
The DappProvider offers a feature known as batch transactions, which enables developers to sequence transactions. 
For example, you can wait for one transaction to finish before sending another. 
This functionality is seamlessly integrated into the DappProvider, making it easy to use.

## Important Note
For the DappProvider to work seamlessly, it's crucial to place some built-in components under it. 
These components handle various aspects of transactions' signing and tracking. Specifically, you should include:

1. `SignTransactionsModals`: Responsible for managing the sign transaction flows across all providers.
2. `TransactionsToastList`: Handles the display of toasts that show the status of transactions.

** Note: you are not required to use this feature if you choose to have your own implementation. 
For example, you may choose to show a spinner or a full-page loader as UI and track the transactions under the hood with the same hooks used by the TransactionsToastList. **

Incorporating these components under the DappProvider ensures that all aspects of your dApp, including transaction signing and tracking, function smoothly.

```jsx
<DappProvider
   environment="devnet"
   customNetworkConfig={customNetworkConfig} // optional
   dappConfig={dappConfig} // optional
>
  <SignTransactionsModals />
  <TransactionsToastList />
  {...your dapp content}
</DappProvider>
```


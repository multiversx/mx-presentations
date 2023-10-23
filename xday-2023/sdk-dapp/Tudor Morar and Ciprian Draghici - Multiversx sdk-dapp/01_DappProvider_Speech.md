# 1. DappProvider Speech

Creating a dApp on the MultiversX blockchain should be a seamless and user-friendly experience. 
To make this vision a reality, we've introduced the `@multiversx/sdk-dapp` library, a dedicated toolkit designed to simplify dApp development on the MultiversX blockchain. 
This library streamlines interactions with the blockchain by offering a wealth of components, hooks, and functions, allowing developers to build dApps from the ground up with ease.

We'll start our discussion with the DappProvider component. It serves as the cornerstone of your dApp, it's responsible for initializing the entire application and providing context to all other components.

When using the DappProvider component, there are a few mandatory properties that you must configure to ensure your dApp functions correctly:

`environment`: This is a crucial parameter that determines the configuration of your application's endpoints for a specific environment. You can choose from three accepted values: `testnet`, `devnet`, and `mainnet`, each tailored to their respective blockchain environments (also configured in EnvironmentsEnum).
`children`: The children property is of paramount importance, as it encapsulates your entire dApp. Your application's content should be wrapped within the DappProvider component, ensuring that it will be rendered once the dApp initialization process is successfully completed.

Now that we have seen how to use the DappProvider in its basic form, let's explore how we can customize various elements using its optional properties.

`customNetworkConfig`: The `customNetworkConfig` object allows you to configure your network with different APIs and connection providers. This is particularly useful when building custom networks, giving you granular control over network details.
`externalProvider`: The `externalProvider` property allows you to use your own wallet provider implementation, such as an extension provider or web wallet provider, adding flexibility to how users access your dApp.
`customComponents`: With the `customComponents` property, developers can implement their own transaction sender and tracker components, providing a tailored experience for their users.
`dappConfig`: The `dappConfig` object lets you specify additional configurations, including the logout route and whether to use a web view provider.


We are using some defaults for the optional properties, so even by unsetting them we'll still have a ready and working dApp.

## Disclaimer: 
It's worth noting that the `DappProvider` component serves as a wrapper for your entire application and should only be used once within your application's structure.

## Note: 
Additionally, for the smooth operation of the `DappProvider` and to avoid any manual configuration hassles related to signing and tracking transactions, there are two mandatory components that should be included under the `DappProvider` component:

1. `SignTransactionsModals`: This component takes on the responsibility of managing the sign transaction flows for all providers, ensuring a secure and streamlined signing process.
2. `TransactionsToastList`: Here, you have a component dedicated to displaying the transaction status notifications, keeping users informed about the progress of their transactions within your dApp.

Incorporating these components under the `DappProvider` ensures that all aspects of your DApp, including transaction signing and tracking, function smoothly.


In summary, the DappProvider component is your gateway to a simplified and efficient dApp development experience on the MultiversX blockchain. 
By adhering to these guidelines and incorporating the required components, you can build powerful decentralized applications that seamlessly interact with the blockchain, all while ensuring an user-friendly experience.

Thank you for choosing MultiversX for your dApp development journey.
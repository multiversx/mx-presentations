Structure proposal
Introduction:

Sdk-Dapp package by Tudor Morar and Ciprian Draghici: 

1. Brief Overview: 
A. What you need to know to follow this tutorial?
    We assume that you have some basic knowledge of React or React-Native. We also assume that you have some basic knowledge of the blockchain and how it works. If you don't have any knowledge of the blockchain, we recommend you to read first chapters of the MultiversX documentation first.
B. What will you learn at the end of this tutorial?
    At the end of this tutorial, you will be able to build a dApp from scratch using the @multiversx/sdk-dapp package. You will learn how to connect to the blockchain, how to create transactions, how to sign them, how to send them, and how to track them. You will also learn how to use the different components and hooks exposed by the package.

2. Background:

History and Evolution:
In 2020, when we started working on the first dApp, we had to build everything from scratch. We had to create a wallet, connect to the blockchain, create transactions, sign them, send them, and track them. We had to create a lot of components and functions to make all these things work together.
At some point, we realized that we are doing the same things over and over again, and we decided to create a package that will help us build dApps faster and easier.
We started with a simple package that was exposing some functions and hooks to help us connect to the blockchain and create transactions. This package was called dapp-core.
After several months we decided there was a need to support React-Native so we needed a new architecture for the package. We decided to create a new package that will be used by both React and React-Native applications. This is how sdk-dapp was created. Along with sdk-dapp we also developed different task-specific Front-End sdks like sdk-dapp-staking or sdk-dapp-nft. 
The whole philosophy behind sdk-dapp was to have a package split into components and hooks that can be used either with a visual library like React or React-Native or with a non-visual library like Next.js. Of course React-Native only makes use of hooks and implements it's own views. 

Agenda: List out what will be covered in the next segments.
This tutorial will be split in two parts, one that will cover a specific task of building a dApp that interacts with a contract, and one that will cover the general usage of the sdk-dapp package.

Importance of thematic: 
As noted before, some elements require quite a lot of setup and boilerplate code to work. If you would try to implement them yourself, you would risk having to overcome the same problems we did, and resolve them trough iterations. One example would be interacting with the ledger device, or the Web Wallet. Actually, one of the main reasons why sdk-dapp's architecture is a bit more complex is that it needs to rebuild it's state after being redirected from the Web Wallet. In order to tackle this problem, we developed the concept of sessionId, an unique identifier that is generated at the moment of sending transactions to the account provider. This sessionId is then used to rebuild the state from session storage or local storage. We hope to resolve this in version 3.0.0, but this is a topic for another time.

3. Basic Concepts:

Definition:
`@multiversx/sdk-dapp` is a library dedicated to building dApps on the MultiversX blockchain and to facilitate the interaction with the blockchain.
It exposes many components, hooks, and functions to help the developers build a dApp from scratch in a simpler way.

Key Terms: 
Network: The network on which the dApp is running (ex: Mainnet/Devnet/Testnet)
Address: The address of the user's wallet
Balance: The balance of the user's wallet
Nonce: The term "nonce" is an abbreviation for "number used only once". The nonce is the number of transactions made from a given address. It gets incremented after each successful transaction.
Account provider: The public-private key pair manager


4. Examples:
a) Delegation dashboard https://github.com/multiversx/mx-delegation-dapp
The Delegation Dashboard application is an administration panel for the staking providers to manage their contract settings and nodes. They have the option to tweak service fees, redelegation settings, as well as manage the activity of their nodes.

b) MultiversX Utils https://github.com/multiversx/mx-utils-dapp
The MultiversX Utils application is a tool whose purpose is to facilitate development on the MultiversX Network. Thus, it offers the ability of converting addresses, hexadecimals values and much more, as well as verify messages and sign messages, or decode various data from the nativeAuth token authentication mechanism.

c) MultiversX Template dApp https://github.com/multiversx/mx-template-dapp
The MultiversX Template dApp is a basic implementation of @multiversx/sdk-dapp, providing the basics for MultiversX authentication and TX signing. It will be used in this tutorial for explaining the basic concepts of the package.

d) MultiversX Blockchain Exolorer

5. Hands-on Session:

Setting Up: 
Make sure you have the following installed:
Node.js  > v16.19.1
Yarn
Git
Visual Studio Code
Google Chrome

Walkthrough: Presentation Part 1 Ping-Pong Contract

Github Repo: https://github.com/multiversx/mx-template-dapp

6. Template-like Presentation:

Blueprint for Implementation: Presentation Part 2 sdk-dapp chapters

Customization Tips: 
The template-dapp repo was built in such a way that you can exclude functionalities you won't integrate. For example, if you are not interested in message signing, feel free to remove the SignMessage component from /components folder. 
If you are using NextJS make sure to check out https://github.com/multiversx/mx-template-nextjs-dapp

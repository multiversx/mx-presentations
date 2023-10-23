# 6. Create Transactions Speech

Today, I would like to delve into the fascinating world of the blockchain technology and its transactions.
Specifically, I will be discussing two distinct methods of creating transactions within a blockchain ecosystem. 
These transactions play a pivotal role in facilitating the exchange of digital assets and their significance cannot be overstated.

## Method 1: Using the `newTransaction` Function

Our first method involves the utilization of a versatile function known as `newTransaction`. 
This function is akin to the craftsman's tool, allowing us to mold and shape transactions as per our requirements. 
Let's dissect its anatomy.

A valid transaction, ready to be signed and sent, is the ultimate goal. 
To construct one, we need an object comprising of several essential properties. 
These properties include:

`Nonce`: A unique number associated with each transaction, preventing double-spending.
`Value`: The amount of digital currency being transferred.
`Receiver`: The recipient's address.
`Sender`: The sender's address.
`Receiver Username`: An optional field for identifying the recipient by username.
`Sender Username`: Another optional field for identifying the sender by username.
`Guardian`: An optional guardian for the transaction.
`Gas Price`: The price paid for computational resources on the network.
`Gas Limit`: The maximum amount of computational resources allocated to the transaction.
`Data`: Additional data that can be included with the transaction.
`Chain ID`: The blockchain network identifier, to which the transaction belongs.
`Version`: The version of the transaction.
`Options`: Additional options for the transaction.
`Signature`: An optional field for the transaction's digital signature.
`Guardian Signature`: An optional signature from the guardian.

Upon assembling these properties into an object, we invoke the `newTransaction` function. 
The result is a Transaction object, defined within the @multiversx/sdk-core package. 
This Transaction object is a masterpiece, ready to be signed and sent across the blockchain.

## Method 2: Creating Transactions from ABI

Our second method employs a different approach. It involves creating transactions from an ABI (Application Binary Interface). 
Here, we interact with a smart contract residing on the blockchain.

We start by importing the ABI of the smart contract, which essentially provides a blueprint of its functions and data structures. 
We also specify the address of the smart contract we wish to interact with.

With this information in hand, we can craft transactions for specific smart contract functions. 
For example, in the code snippet, we see transactions for functions called ping and pong. 
These transactions are assembled using a fluent interface, allowing us to specify various attributes such as value, gas limit, and chain ID.

The resulting transactions are, once again, ready to be signed and sent. They represent interactions with the smart contract and carry out specific actions as dictated by the smart contract's functions.


In conclusion, transactions lie at the heart of blockchain technology, enabling the secure and transparent transfer of digital assets and the execution of smart contract functions. 
Whether you choose to create transactions using the `newTransaction` function or by interacting with a smart contract's ABI, you are harnessing the power of blockchain to make things happen in a decentralized world.

Thank you for your attention!
# Workshop

Hello everyone and welcome to this workshop!

Today we are going to have a quick lesson on interacting with the MultiversX blockchain using JavaScript.

We will learn to talk to the Network through a so-called network provider, and we'll create, sign and broadcast transactions (including Smart Contract calls), and query accounts state (including Smart Contract state).

We'll do so by creating three very simple CLI applications.

For this workshop we will use only the sdk-core. Since V13 the sdk-wallet and sdk-network-providers where included into sdk-core.

- [@multiversx/sdk-core](https://www.npmjs.com/package/@multiversx/sdk-core)

Even though it is written in TypeScript, today we will be referencing it from plain, simple JavaScript projects.

Note that this isn't the complete set of TypeScript libraries available for MultiversX. For more libraries, make sure to check out the documentation. To name a few:

 - `mx-sdk-dapp`, for dapp developers
 - `mx-sdk-nestjs`, useful for developers of microservices

With the final major release we finished the standardization for the SDKs. Make sure to follow the specs repository here:

 - https://github.com/multiversx/mx-sdk-specs

To find out more regarding the javascript and python SDKs you can refer to the cookbook

 - https://docs.multiversx.com/sdk-and-tools/sdk-js/sdk-js-cookbook
 - https://docs.multiversx.com/sdk-and-tools/sdk-py/sdk-py-cookbook

With the last major release we introduced entrypoints and we will use them to show how easy it is to create transactions now.
These being said, let's take a quick overview of the tiny applications we are going through today.

**The first one**, called `transfers` allows one to:
 - Create, sign and broadcast EGLD and ESDT transfers;
 - Query the balances of an account;

**The second one**, called `adder`, allows one to deploy the simple, well-known `Adder` Smart Contract, and then interact with it, but without using the ABI-aware components.

**Short note:** The ABI of a contract (generally provided as a JSON file) is a description of the contract's interface, including the endpoints it exposes, their arguments and return types, and more. Using `sdk-js`, you can interact with a contract whether you have its ABI or not.

Back to our list:

**The third one**, called `lottery`, allows one to deploy the well-known `Lottery` Smart Contract, and then interact with it, but, this time, using the ABI-aware components.

## Code

To keep the workshop more focused, we've prepared the code beforehand. 

If you'd like to follow along, you can find it here:

 - https://github.com/multiversx/mx-presentations

Let's get started!

## Environment

For our purposes, we will connect to Devnet via DevnetEntrypoint. We are going to use the MultiversX API as our entrypoint to the Network.

## Shared components

Before seeing the applications, let's jump a bit to file called `shared.js`, where we've added some common functionality for them.

Let's have a quick look over the `AppBase` class.

In the constructor, we create and retain:
 - a `DevnetEntrypoint` (we don't need to pass any config as it uses th devnet API by default)
 - and a provider (the MultiversX API) created via devnetEntrypoint.

Then, we have the function `loadAccount`, able to load a JSON keyfile, ask the user for the password, and return a `Account` object. With this we can sign transactions, verify signatures, get the nonce and some other stuff that I encourage you to go and check out.

Moving on, we've defined an additional class called `ContractAppBase` to hold some common functionality for this tutorial's second and third applications (that interact with Smart Contracts). Let's have a quick look over it, as well.

It buils upon `AppBase`, and adds the following:

Here, we've defined utility functions to load the contract bytecode, and the contract ABI. They will come in handy a bit later.

All right, now...

Let's move to the first app!

## First app

We'll be transferring EGLD and ESDT tokens, and we'll be querying the balances of an account. We will build the transactions using the TransfersController that we create it via the endpoint or the TransferTransactionsFactory. Whenever you need a quich script to test something you could use the controller and when you are building a DAPP you could use the factory. 

Here's the skeleton of the application. We are going to implement the following commands:

💻 `transfers.js`

### Transfer EGLD

As input arguments ...

The implementation looks like this: ...

First, we gather the prerequisites to create and sign the transaction, then with the controller help we create and sign the transaction. In the end, we broadcast it to the Network.

We added also the transfer using the factory. We followed the same scenario, we prepared the parameters and the we build the transaction with the factory help. Then we set the transaction nonce that we took with the entrypoint help and sign the transaction with the senderAccount. In the end, same as with the controller we broadcast it to the Network.
💻

In `snippets.sh`, there are a few shortcuts to smoke test our applications. Let's invoke `transferEGLD`.

This will transfer 0.1 EGLD from Frank to Grace.

### Transfer ESDT

As input arguments ...

The implementation looks like this: ...

It's somehow similar to `transferEGLD`. Though, it relies on `createTransactionForEsdtTokenTransfer` which chooses the right type of transaction to create based on the provided token identifier. 

Once we've created the right transaction, we sign and broadcast it. We build this example with both the controler and the factory to get used to both methods

Let's give it a try, let's invoke `transferESDT` from `snippets.sh`. This will transfer 100 One tokens from Alice to Bob.

💻

### Query balances

Now let's query all the balances of an account.

As input arguments ...

Here we call these three functions on the network provider, and retrieve the balances for all kinds of tokens, and we go through the results and print what's interesting.

That's it.

Let's move to the second app!

💻

## Second app

We'll be deploying the `Adder` Smart Contract, and we'll be interacting with it.

As mentioned before, the `Adder` contract is an extremely simple one. You can add a number to the accumulator, and you can query the current value of the accumulator.

### Deploy contract

As before, we gather the prerequisites to create the transaction. But this time, we need a contract bytecode, as well, so we load it from the file `adder.wasm` - which we've prepared beforehand, in the folder `contracts`.

Then, we create and sign the deploy transaction with the controller help and broadcast it.

We also wait for the transaction to complete, then parse, and display some pieces of its outcome (in our case, the contract address).

Let's invoke the deployment from our snippets and see what happens.

Alice will be deploying the contract. 

Let's save the contract address for later.

### Add value

Input arguments ...

As mentioned earlier, we won't be using the ABI-aware components for this second application. We'll use them in the third one, though.

This is how we prepare the transaction to call the `add` function of the `Adder` contract. Here we pass a single argument to `add`, as a big unsigned integer.

Let's sign, broadcast, and wait for the transaction to complete.

Let's also cover the `get-sum` function. We'll smoke test both commands afterwards.

### Get sum

Now we will be querying the current value of the accumulator, as it is stored in the contract's state, on the blockchain.

This is how we create a contract `query` object, then run it on the network provider. We parse the outcome, then decode and display the result we are interested in. As you can see, here we explicitly rely on the `BinaryCodec`. In the third application, when using the ABI-aware components, that will be hidden under the hood.

Let's invoke some snippets!

## Third app

We'll de deploying the `Lottery` Smart Contract, and we'll interact with it.

The contract works as follows: anyone can start a lottery, then participants can buy tickets and hope to win. The winner is chosen by calling the `determineWinner` function.

We'll first cover the code, then we'll play with the snippets.

You should already be familiar with the deploy step by now, so let's skip it.

Let's go straight to the `start` function.

### Start

This one requires the following input arguments: the name of the lottery, the token to be used for buying tickets, the price of a ticket, and the duration of the lottery.

Here, we load the ABI of the contract, which we'll pass to the constructor of the `SmartContract` facility.

We will relly on the controller here also or if you want you can do this easly with the factory.

Once we have created the transaction, we sign and broadcast it.

### Get lottery info

This one is similar to the query we've seen in the second app. However, this time we're dealing with a much more complex return type - but the controller will help us here with the parsing, being informed about the ABI, will take care of it.

### Buy ticket

This is an example of what is called "transfer & execute". We are transferring some tokens to the contract (to pay the price for the ticket), and we are executing a function on it, as a single transaction.

We are doing also using the controller function and passing a `TokenTransfer` to it.

### Determine winner

This function doesn't bring anything new, it's just another example of a contract call. Let's jump to the snippets!

## Conclusion

That’s it!

We’ve reached the end of the tutorials.

We’ve learned to interact with a network provider, to create, sign and broadcast transactions, to query account state, and to deploy and interact with Smart Contracts.

Thank you!

Don't forget to check out the existing documentation, the workshops repository, and the specs, which have been updated!

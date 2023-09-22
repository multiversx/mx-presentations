# Workshop

Hello everyone and welcome to this workshop!

Today we are going to have a quick lesson on interacting with the MultiversX blockchain using JavaScript.

We will learn to talk to the Network through a so-called network provider, and we'll create, sign and broadcast transactions (including Smart Contract calls), and query accounts state (including Smart Contract state).

We'll do so by creating three very simple CLI applications.

First, let us meet the **sdk-js** libraries we will be using. They are:

- [@multiversx/sdk-core](https://www.npmjs.com/package/@multiversx/sdk-core)
- [@multiversx/sdk-wallet](https://www.npmjs.com/package/@multiversx/sdk-wallet)
- [@multiversx/sdk-network-providers](https://www.npmjs.com/package/@multiversx/sdk-network-providers)

Even though they are written in TypeScript, today we will be referencing them from plain, simple JavaScript projects.

Note that this isn't the complete set of TypeScript libraries available for MultiversX. For more libraries, make sure to check out the documentation. To name a few:

 - `mx-sdk-dapp`, for dapp developers
 - `mx-sdk-nestjs`, useful for developers of microservices

Another thing to keep in mind!

There's an ongoing effort to standardize the network interaction SDKs, so they become consistent across all programming languages. Make sure to follow the specs repository here:

 - https://github.com/multiversx/mx-sdk-specs

And, since the specs are in progress, the implementing libraries are still subject to change and improvement. For example, while the JavaScript and the Python libraries are mostly aligned with one another (see the cookbooks), they are not aligned YET with the newer specs.

 - https://docs.multiversx.com/sdk-and-tools/sdk-js/sdk-js-cookbook
 - https://docs.multiversx.com/sdk-and-tools/sdk-py/sdk-py-cookbook

And since the alignment is not complete yet, in this workshop we will be using the libraries as they are now. 

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

For our purposes, we will connect to Devnet 2. We are going to use the MultiversX API as our entrypoint to the Network. Additionally, for simplicity, we've hardcoded the chain ID for Devnet 2, as well:

💻 `config.js`

## Shared components

Before seeing the applications, let's jump a bit to file called `shared.js`, where we've added some common functionality for them.

Let's have a quick look over the `AppBase` class.

In the constructor, we create and retain:
 - an `ApiNetworkProvider` (initialized with the URL of the MultiversX API)
 - a `TransactionWatcher`, which we will use to detect transaction completion

Then, we have the function `loadSigner`, able to load a JSON keyfile, ask the user for the password, and return a `UserSigner` object.

Now, as you might now, each transaction broadcasted to the Network must have the `nonce` field set consistently with the account nonce on-chain.

So, we will use `recallAccountNonce` function to do just that, to query the current nonce of the account, to be set on the transactions.

`signTransaction` receives a transaction and a previously-loaded signer, serializes and signs the transaction, and returns it, ready to be broadcasted by ...

`broadcastTransaction` - under the hood, this performs a POST request to the MultiversX API, carrying the JSON-serialized, now signed transaction.

Often, you'd like to wait for a transaction to be processed by the Network, before continuing the flow of the application. For this, we have `awaitTransactionCompletion`, which uses the `TransactionWatcher` created in the constructor.

Moving on, we've defined an additional class called `ContractAppBase` to hold some common functionality for this tutorial's second and third applications (that interact with Smart Contracts). Let's have a quick look over it, as well.

It buils upon `AppBase`, and adds the following:

In the constructor, a `ResultsParser`, commonly used to parse the outcome of Smart Contract calls and queries.

Then, we've defined utility functions to load the contract bytecode, and the contract ABI (into a so-called `AbiRegistry`). They will come in handy a bit later.

`parseDeployOutcome` uses the `ResultsParser` to check the `returnCode` of deployments, then searches through the transaction logs to find the address of the deployed contract.

`assertSuccessfulOutcome` will be used to check the `returnCode` of Smart Contract transactions, whether deployments or contract calls.

All right, now...

Let's move to the first app!

## First app

We'll be transferring EGLD and ESDT tokens, and we'll be querying the balances of an account.

Here's the skeleton of the application. We are going to implement the following commands:

💻 `transfers.js`

### Transfer EGLD

As input arguments ...

The implementation looks like this: ...

First, we gather the prerequisites to create and sign the transaction, then we actually create the transaction (note the `amount`, passed as the `value` field of the transaction), and sign it using the signer. In the end, we broadcast it to the Network.

Of course, we rely on some functions defined in `shared.js`, that we've just seen.

💻

In `snippets.sh`, there are a few shortcuts to smoke test our applications. Let's invoke `transferEGLD`.

This will transfer 0.1 EGLD from Frank to Grace.

### Transfer ESDT

As input arguments ...

The implementation looks like this: ...

It's somehow similar to `transferEGLD`. Though, it relies on `createCustomTokenTransferTransaction` which chooses the right type of transaction to create based on the provided token identifier. By the way, the new SDK specs describe a simplified way to achieve this. So, stay tuned for updates!

Once we've created the right transaction, we sign and broadcast it.

Let's give it a try, let's invoke `transferESDT` from `snippets.sh`. This will transfer 100 chocolate tokens from Frank to Grace.

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

Then, we create the deploy transaction, sign it, and broadcast it.

We also wait for the transaction to complete, then parse, and display some pieces of its outcome (in our case, the contract address).

Let's invoke the deployment from our snippets and see what happens.

Frank will be deploying the contract. 

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

This time, to create the contract call, we are using the "interactions" API, which is ABI-aware.

Note that this "interactions" API will have a prettier and simpler alternative in the future, as seen in the new SDK specs.

Once we have created the transaction, we sign and broadcast it.

### Get lottery info

This one is similar to the query we've seen in the second app. However, this time we're dealing with a much more complex return type - but the `ResultsParser`, being informed about the ABI, will take care of it.

### Buy ticket

This is an example of what is called "transfer & execute". We are transferring some tokens to the contract (to pay the price for the ticket), and we are executing a function on it, as a single transaction.

We are doing so by using the `withSingleESDTTransfer()` function and passing a `TokenTransfer` to it.

The new SDK specs already describe a better way to do this, so stay tuned for updates!

### Determine winner

This function doesn't bring anything new, it's just another example of a contract call, using the "interactions" API and the ABI. Let's jump to the snippets!

## Conclusion

That’s it!

We’ve reached the end of the tutorials.

We’ve learned to interact with a network provider, to create, sign and broadcast transactions, to query account state, and to deploy and interact with Smart Contracts.

Thank you!

Don't forget to check out the existing documentation, the workshops repository, and the specs, which we are currently cooking!

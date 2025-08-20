Hello everyone and welcome to this workshop!

Today I am going to show you how to interact with the MultiversX blockchain using Python.

We will query accounts state and then we are going to create, sign and broadcast transactions for sending tokens and interacting with smart contracts.

For this workshop, we're going to use the official Python SDk, which is currently at v2. You can check out the code on GitHub, or download it straight from PyPi.

Let me walk you through what we'll do today:
1. First, we'll query accounts state, to get the token balance, for both native and ESDT tokens.
2. After we fetch the balance, we will send these tokens to some other address.

In the second part, we're going to deploy and interact with **Adder** smart contract, but without using the ABI-aware components. If available, you should always use the ABI since it makes things a lot easier.

**Short note:** The ABI of a contract (generally provided as a JSON file) is a description of the contract's interface, including the endpoints it exposes, their arguments and the return types. Using `sdk-py`, you can interact with a contract whether you have its ABI or not.

In the end, we're going to interact with the **Lottery** smart contract, but this time using the ABI.

I've created a virtual environment, installed the sdk and created a Jupyter Notebook to run the code because it makes it a bit easier. To keep the workshop more focused and a bit shorter, I've prepared the code already, but there should be a link to the code in the description of this video.

In the latest releases we've introduced Entrypoints, which are very versatile and easy to use. They make it a lot easier to create transactions.

## Environment

We will connect to Devnet via DevnetEntrypoint. This uses the MultiversX API as our entrypoint to the Network.

## Conclusion

That’s it!

We’ve reached the end of the tutorials.

We’ve learned to create, sign and broadcast transactions, to query account state, and interact with Smart Contracts.

If there are questions feel free to leave them in the comments and don't forget to check out the existing documentation, all the necessary links will be in the description.

Thank you for listening and I'll see you in the next one!

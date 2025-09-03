# mxpy

Hello, today I will present you the MultiversX CLI tool. Before we start, I want to say that all the resources presented here will be also available to you. Links to the documentation and to the GitHub repositories will also be provided. Let's get started!

**`mxpy`** is a CLI tool facilitating the interaction with the MultiversX blockchain and with Smart Contracts.

Some of it's key features are:

- Generate and convert wallets from one format to another
- Sign and send transactions
- Deploy, execute and query Smart Contracts

And also many more. For a full list of features use the `--help` argument or check out the documentation.

## Installing mxpy

The recommended way of installing `mxpy` is using `pipx`. Pipx is a tool that helps us run CLI apps. I already have pipx installed, but you can find a link to the official pipx website in the description of this video. Once pipx is installed we simply run the following command:

```sh
pipx install mxpy
```

In order to check if everything works as expected you can type the following command in the terminal:

```sh
mxpy --version
```

The version should be displayed in the terminal. As you can see, I have the `11.1.1` version.

You can see what each command does and what arguments it needs by simply typing:

```sh
mxpy --help
mxpy contract --help
```

## Upgrading mxpy

You can upgrade to a newer `mxpy` version by using the upgrade command that pipx provides.

```sh
pipx upgrade mxpy
```

## Creating wallets

There are a couple available wallet formats:

- `raw-mnemonic` - secret phrase in plain text
- `keystore-mnemonic` - secret phrase, as a password-encrypted JSON keystore file
- `keystore-secret-key` - secret key (irreversibly derived from the secret phrase), as a password-encrypted JSON keystore file
- `pem` - secret key (irreversibly derived from the secret phrase), as a PEM file

For this example, we are going to create a `keystore-mnemonic` wallet.

Let's create a keystore wallet:

```sh
mxpy wallet new --format keystore-mnemonic --outfile keystore.json
```

The wallet's mnemonic will appear, followed by a prompt to set a password for the file. Once you input the password and press Enter, the file will be generated at the location specified by the `--outfile` argument. Will set the password to be `password`.

> **_INFO:_** The network does not register a newly created address until funds are sent to that address. You'll need funds for deploying contracts and sending transactions. Easyest way to get funds is to use the [faucet](https://devnet-wallet.multiversx.com/faucet).

## Converting wallets

You can convert your wallet from certain types to another wallet types.

Let's convert the previously created `keystore-mnemonic` to a `PEM` wallet. We discourage the use of PEM wallets for storing cryptocurrencies due to their lower security level. However, they prove to be highly convenient and user-friendly for application testing purposes.

To convert the wallet we type the follwing command:

```sh
mxpy wallet convert --infile keystore.json --in-format keystore-mnemonic --outfile wallet.pem --out-format pem
```

After being prompted to enter the password you've previously set for the wallet the new `.pem` file will be created.

## Creating and sending transactions

To create a new transaction we use the `mxpy tx new` command. We will use a `.pem` file for the sake of simplicity but you can easily use a `keystore wallet`. Let's create a new transaction running the following command.

```sh
mxpy tx new --pem wallet.pem \
--receiver erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th \
--value 1000000000000000000 \
--proxy https://devnet-gateway.multiversx.com \
--send
```

That's it! As easy as that. We sent a transaction from our wallet to Alice. We choose the receiver of our transaction using the `--receiver` argument. We used the `--value` argument to pass the value that we want to transfer but we passed in the denomintated value. We transferred 1 eGLD (1 \* 10^18). We then specify the api for the network we want to send our transaction to and use the `--send` argument to broadcast it.

## Sending ESDT tokens

Sending ESDT tokens is very similar to sending EGLD, but instead of using the `--value` argument we will use an argument called `--token-transfers`. For this example we'll be sending a fungible token and an NFT, for you to see how the tokens should be passed to the command. Let's check out the command:

```sh
mxpy tx new --pem alice.pem \
--receiver erd1r69gk66fmedhhcg24g2c5kn2f2a5k4kvpr6jfw67dn2lyydd8cfswy6ede \
--token-transfers ONE-83a7c0 1000000000000000000 TST2-42452a-06 1 \
--proxy https://devnet-gateway.multiversx.com \
--send
```

## Deploying Smart Contracts

To deploy a smart contract you have to send a transaction to a special address on the network called the `Smart Contract Deploy Address`, but you don't have to worry about setting the receiver of the transaction because `mxpy` takes care of it.

Our contract is located here: `~/Workshop/adder`. After building the contract the generated `.wasm` file will be here: `~/Workshop/adder/output/adder.wasm`. The `adder.wasm` file contains the bytecode we will be deploying on the network.

After making sure that our contract is built and we have enough funds to pay the gas we can deploy the contract by running the follwing command:

```sh
mxpy contract deploy --pem wallet.pem \
--bytecode adder/output/adder.wasm \
--arguments 0 \
--proxy https://devnet-gateway.multiversx.com \
--send
```

The `--bytecode` argument is used to provide the generated `.wasm` file, the `--proxy` is used to specify the url of the proxy.

The `--arguments` is used in case our contract needs any arguments for the initialization. We know our `adder` needs a value to start adding from, so we set that to `0`.

The `--pem` argument is used to provide the sender of the transaction, the payer of the fee. The sender will also be the owner of the contract. Finally, the `--send` is used to send the transaction to the network. We can prepare the same transaction without providing the `--send` argument and we will get the same transaction, but it won't be broadcasted. This is useful when preparing transactions in advance that we want to broadcast later. The command accepts a couple more parameters that can be found by simply typing `mxpy contract deploy -h`.

## Calling the Smart Contract

After deploying our smart contract we can start interacting with it. The contract has a function called `add()` that we can call and it will increase the value stored in the contract with the value we provide.

To call a function we use the `mxpy contract call` command. Here's an example of how we can do that:

```sh
mxpy contract call <contract address> \
--pem wallet.pem \
--function add --arguments 7 \
--proxy https://devnet-gateway.multiversx.com \
--send
```

The positional argument is the contract address that we want to interact with. The `--pem` and `--proxy` arguments are used the same as above in the deploy transaction.

Using the `--function` argument we specify the function we want to call and using `--arguments` argument we specify the argument required by the function, the value we want to add.

## Querying a Smart Contract

Querying a contract is done by calling a so called `view function`. We can get data from a contract without sending a transaction to the contract, basically without spending money.

As you know, our contract has a function called `add()` that we previously called, and a `view function` called `getSum()`. Using this `getSum()` function we can see the value that is currently stored in the contract.

If you remember, when we deployed the contract we passed the value `0` as a contract argument, this means the contract started adding from `0`. When calling the `add()` function we used the value `7`. This means that now if we call `getSum()` we should get the value `7`. To do that, we use the `mxpy contract query` command. Let's try it!

```sh
mxpy contract query <contract address> \
--function getSum
--proxy https://devnet-gateway.multiversx.com
```

We see that `mxpy` returns our value as a bytes value.

## Upgrading a Smart Contract

In case there's a new release of your Smart Contract, or perhaps you've patched a possible vulnerability you can upgrade the code of the Smart Contract deployed on the network.

Let's modify our adder contract, let's add `1` to every value added to the contract. [modify contract code here: value + 1u32] Now everytime the `add()` function is called will add the value provided with `1`.

Before deploying the contract we need to build it again to make sure we are using the latest version. We then deploy the newly built contract, then we call it and query it.

```sh
mxpy contract upgrade <contract-address> \
--bytecode adder/output/adder.wasm \
--proxy=https://devnet-gateway.multiversx.com \
--arguments 0 \
--pem=wallet.pem \
--send
```

We provide as a positional argument the contract's address that we want to upgrade, in our case the previously deployed adder contract. The `--bytecode` is used to provide the new code that will replace the old code. We also set the `--arguments` to `0` as we didn't change the constructor and the contract will start counting from `0` again. The rest of the arguments you know from all the previous operations we've done.

Now let's add `7` to the contract one more time. We do so by running the following:

```sh
mxpy contract call <contract-address> \
--pem=wallet.pem \
--proxy=https://devnet-gateway.multiversx.com \
--function add --arguments 7 \
--send
```

Now, if we query the contract we should see the value `6`. We added `5` in the contract but modified the contract code to add `1` to every value. Let's see!

```sh
mxpy contract query <contract_address> --proxy https://devnet-gateway.multiversx.com --function getSum
```

We see that we indeed got the value `6`. Our upgrade was sucessfull.

# mxpy

Hello, today I will present you the MultiversX CLI tool. Before we start, I want to say that all the resources presented here will be also available to you. Links to the documentation and to the GitHub repositories will also be provided. Let's get started!

**`mxpy`** is a CLI tool facilitating the interaction with the MultiversX blockchain and with Smart Contracts.

Some of it's key features are:

- Sign and send transactions
- Compile and test Smart Contracts
- Deploy, execute and query Smart Contracts
- Generate and convert wallets from one format to another
- Set up, start and control localnets

## Installing mxpy

We recommend installing `mxpy` using the `mxpy-up` installation script. All you need to do is run the following commands in the terminal:

```sh
wget -O mxpy-up.py https://raw.githubusercontent.com/multiversx/mx-sdk-py-cli/main/mxpy-up.py
python3 mxpy-up.py
```

This will create a light Python virtual environment (based on venv) in `~/multiversx-sdk/mxpy-venv`. You'll need to manually include ~/multiversx-sdk in your $PATH variable (by editing the appropriate `.profile` file) as done below:

```
export PATH="$HOME/multiversx-sdk:$PATH"
```

After the installation you may need to restart the user session in order to use `mxpy`.

In order to check if everything works as expected you can type the following command in the terminal:

```sh
mxpy --version
```

The version should be displayed in the terminal. As you can see, I have the `8.1.0` version.

You can see what each command does and what arguments it needs by simply typing:

```sh
mxpy --help
mxpy contract --help
```

## Upgrading mxpy

You can upgrade to a newer `mxpy` version by typing the same commands that were used to install `mxpy`.

```sh
wget -O mxpy-up.py https://raw.githubusercontent.com/multiversx/mx-sdk-py-cli/main/mxpy-up.py
python3 mxpy-up.py
```

This will recreate the light Python virtual environment (based on `venv`) in `~/multiversx-sdk/mxpy-venv`. Since you've had a previous `mxpy` version installed, you probably have already altered the `$PATH` variable so you don't have to re-alter it.

## Creating wallets

There are a couple available wallet formats:

- `raw-mnemonic` - secret phrase in plain text
- `keystore-mnemonic` - secret phrase, as a password-encrypted JSON keystore file
- `keystore-secret-key` - secret key (irreversibly derived from the secret phrase), as a password-encrypted JSON keystore file
- `pem` - secret key (irreversibly derived from the secret phrase), as a PEM file

For this example, we are going to create a `keystore-mnemonic` wallet.

Let's create a keystore wallet:

```sh
mxpy wallet new --format keystore-mnemonic --outfile test_wallet.json
```

The wallet's mnemonic will appear, followed by a prompt to set a password for the file. Once you input the password and press Enter, the file will be generated at the location specified by the `--outfile` argument. Will set the password to be `password`.

> **_INFO:_** The network does not register a newly created address until funds are sent to that address. You'll need funds for deploying contracts and sending transactions. Easyest way to get funds is to use the [faucet](https://devnet-wallet.multiversx.com/faucet).

## Converting wallets

You can convert your wallet from certain types to another wallet types.

Let's convert the previously created `keystore-mnemonic` to a `PEM` wallet. We discourage the use of PEM wallets for storing cryptocurrencies due to their lower security level. However, they prove to be highly convenient and user-friendly for application testing purposes.

To convert the wallet we type the follwing command:

```sh
mxpy wallet convert --infile test_wallet.json --in-format keystore-mnemonic --outfile converted_wallet.pem --out-format pem
```

After being prompted to enter the password you've previously set for the wallet the new `.pem` file will be created.

## Creating and sending transactions

To create a new transaction we use the `mxpy tx new` command. We will use a `.pem` file for the sake of simplicity but you can easily use a `keystore wallet`. Let's create a new transaction running the following command.

```sh
mxpy tx new --pem converted_wallet.pem --recall-nonce \
    --receiver erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th \
    --gas-limit 50000 --value 1000000000000000000 \
    --proxy https://devnet-gateway.multiversx.com --chain D \
    --send
```

That's it! As easy as that. We sent a transaction from our wallet to Alice. We choose the receiver of our transaction using the `--receiver` argument and setted the gas limit to `50000` because that is the gas cost of a simple move balance transaction. Notice we used the `--value` argument to pass the value that we want to transfer but we passed in the denomintated value. We transferred 1 eGLD (1 \* 10^18). We then specify the proxy and the chain ID for the network we want to send our transaction to and use the `--send` argument to broadcast it.

In case you want to save the transaction you can also provide the `--outfile` argument and a `json` file containing the transaction will be saved at the specified location.

## Building Smart Contracts

The contract we will be using today is called `adder`, it's a simple contract that adds a value to the contract. This is a public contract, you can find on [github](https://github.com/multiversx/mx-contracts-rs/tree/main/contracts/adder).

Before building your Smart Contract you'll need to have Rust installed.

You can install Rust using `mxpy` by simply typing the following command:

```sh
mxpy deps install rust
```

After Rust is installed our contract is ready to be built. To build it we run the following command:

```sh
mxpy contract build --path <path to contract>
```

If our working directory is already the contract's directory we can skip the `--path` argument as by default the contract's directory is the _current working directory_.

The generated `.wasm` file will be created in a directory called `output` inside the contract's directory. Here we also have the contract's `abi` file[access the file] where we can see the contract's endpoints. This is the constructor that is called when deploying the contract. It needs an argument that we'll pass when deploying the contract. This is the `add` endpoint that we'll call when adding a new value in the contract, and the `getSum` endpoint that we'll call when we want to get the sum of the values that have been added.

## Deploying Smart Contracts

To deploy a smart contract you have to send a transaction to a special address on the network called the `Smart Contract Deploy Address`, but you don't have to worry about setting the receiver of the transaction because `mxpy` takes care of it.

Our contract is located here: `~/Workshop/adder`. After building the contract the generated `.wasm` file will be here: `~/Workshop/adder/output/adder.wasm`. The `adder.wasm` file contains the bytecode we will be deploying on the network.

After making sure that our contract is built and we have enough funds to pay the gas we can deploy the contract by running the follwing command:

```sh
mxpy contract deploy --bytecode adder/output/adder.wasm \
    --proxy=https://devnet-gateway.multiversx.com --chain D \
    --recall-nonce --arguments 0 --gas-limit 5000000 \
    --pem=converted_wallet.pem \
    --send
```

The `--bytecode` argument is used to provide the generated `.wasm` file, the `--proxy` is used to specify the url of the proxy and the `--chain` is used to select on which network the contract will be deployed. The chain ID and the proxy need to match for our transaction to be executed. We can't prepare a transaction for the Devnet (using `--chain D`) and send it using the mainnet proxy (https://gateway.multiversx.com).

The `--recall-nonce` is used to get the nonce of the address so we don't search it manually. It simply makes an API request to get the nonce of the account. The `--arguments` is used in case our contract needs any arguments for the initialization. We know our `adder` needs a value to start adding from, so we set that to `0`. The `--gas-limit` is used to set the gas we are willing to pay so our transaction will be executed. 5 million gas is a bit too much because our contract is very small and simple, but better to be sure. In case our transaction doesn't have enough gas the network will not execute it, saying something like `Insufficent gas limit`.

The `--pem` argument is used to provide the sender of the transaction, the payer of the fee. The sender will also be the owner of the contract. Finally, the `--send` is used to send the transaction to the network. We can prepare the same transaction without providing the `--send` argument and we will get the same transaction, but it won't be broadcasted. This is useful when preparing transactions in advance that we want to broadcast later. The command accepts a couple more parameters that can be found by simply typing `mxpy contract deploy -h`.

## Calling the Smart Contract

After deploying our smart contract we can start interacting with it. The contract has a function called `add()` that we can call and it will increase the value stored in the contract with the value we provide.

To call a function we use the `mxpy contract call` command. Here's an example of how we can do that:

```sh
mxpy contract call <contract-address> \
    --pem=converted_wallet.pem --recall-nonce \
    --proxy=https://devnet-gateway.multiversx.com --chain D \
    --function add --arguments 5 --gas-limit 2000000 \
    --send
```

The positional argument is the contract address that we want to interact with. The `--pem`, `--recall-nonce`, `--proxy` and `--chain` arguments are used the same as above in the deploy transaction.

Using the `--function` argument we specify the function we want to call and with the `--arguments` argument we specify the argument required by the function, the value we want to add. We set the gas we are willing to pay for the transaction and finally we send the transaction.

## Querying a Smart Contract

Querying a contract is done by calling a so called `view function`. We can get data from a contract without sending a transaction to the contract, basically without spending money.

As you know, our contract has a function called `add()` that we previously called, and a `view function` called `getSum()`. Using this `getSum()` function we can see the value that is currently stored in the contract.

If you remember, when we deployed the contract we passed the value `0` as a contract argument, this means the contract started adding from `0`. When calling the `add()` function we used the value `5`. This means that now if we call `getSum()` we should get the value `5`. To do that, we use the `mxpy contract query` command. Let's try it!

```sh
mxpy contract query <contract-address> \
    --proxy https://devnet-gateway.multiversx.com \
    --function getSum
```

We see that `mxpy` returns our value as a base64 string, as a hex number and as a integer. Indee, we see the expected value.

## Upgrading a Smart Contract

In case there's a new release of your Smart Contract, or perhaps you've patched a possible vulnerability you can upgrade the code of the Smart Contract deployed on the network.

Let's modify our adder contract, let's add `1` to every value added to the contract. [modify contract code here: value + 1u32] Now everytime the `add()` function is called will add the value provided with `1`.

Before deploying the contract we need to build it again to make sure we are using the latest version. We then deploy the newly built contract, then we call it and query it.

We should clean the contract first(this simply means deleting the previous build) and then re-build the contract.

To delete the previous build we run the following command:

```sh
mxpy contract clean --path adder/
```

Then we build the new version of the contract:

```sh
mxpy contract build --path adder/
```

Then we upgrade the contract by running:

```sh
mxpy contract upgrade <contract-address> \
    --bytecode adder/output/adder.wasm \
    --proxy=https://devnet-gateway.multiversx.com --chain D \
    --recall-nonce --arguments 0 --gas-limit 5000000 \
    --pem=converted_wallet.pem \
    --send
```

We provide as a positional argument the contract's address that we want to upgrade, in our case the previously deployed adder contract. The `--bytecode` is used to provide the new code that will replace the old code. We also set the `--arguments` to `0` as we didn't change the constructor and the contract will start counting from `0` again. The rest of the arguments you know from all the previous operations we've done.

Now let's add `5` to the contract one more time. We do so by running the following:

```sh
mxpy contract call <contract-address> \
    --pem=converted_wallet.pem --recall-nonce \
    --proxy=https://devnet-gateway.multiversx.com --chain D \
    --function add --arguments 5 --gas-limit 1000000 \
    --send
```

Now, if we query the contract we should see the value `6`. We added `5` in the contract but modified the contract code to add `1` to every value. Let's see!

```sh
mxpy contract query <contract_address> --proxy https://devnet-gateway.multiversx.com --function getSum
```

We see that we indeed got the value `6`. Our upgrade was sucessfull.

## Setting up a localnet

The purpose of a localnet is to allow developers experiment with Smart Contracts and test their own Smart Contracts, in addition to writing unit and integration tests.

The localnet contains:

- Validator Nodes (two, by default)
- Observer Nodes (zero, by default)
- A Seednode
- A MultiversX Proxy

If not specified otherwise, the localnet starts with two shards plus the metachain (each with one validator).

Following a few easy steps we can setup and start our localnet.

First, we create a new folder and navigate to it:

```sh
mkdir -p ~/Workshop/my-first-localnet && cd ~/Workshop/my-first-localnet
```

Then we can create, build and configure the localnet using a single command.

```sh
mxpy localnet setup
```

Then, we start the localnet.

```sh
mxpy localnet start
```

If everything goes well, in the terminal you should see logs coming from the nodes and proxy, something like this:

```sh
INFO:cli.localnet:Starting localnet...
...
INFO:localnet:Starting process ['./seednode', ...
...
INFO:localnet:Starting process ['./node', ...
...
INFO:localnet:Starting process ['./proxy', ...
[PID=...] DEBUG[...] [process/block]       started committing block ...
```

After our localnet has started we can interact with it as we would do with our devnet or mainnet.

The wallets containg funds are minted at the genesis of the localnet and can be found in `~/multiversx-sdk/testwallets/latest/users`. Let's send a transaction on the localnet:

```sh
mxpy tx new --recall-nonce --data="Hello, World" --gas-limit=70000 \
 --receiver=erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx \
 --pem=~/multiversx-sdk/testwallets/latest/users/alice.pem \
 --chain=localnet --proxy=http://localhost:7950 \
 --send
```

We can check the sent transaction by calling the gateway of the localnet:

```
http://localhost:7950/transaction/<tx_hash>
```

### Halting and resuming the localnet

In order to halt the localnet, press `Ctrl+C` in the terminal. This will stop all the processes (nodes, proxy etc.). The localnet can be resumed at any time by running again the command `mxpy localnet start` (from within your workspace).

### Removing the localnet

In order to remove the localnet, run the command (from within your workspace):

```sh
mxpy localnet clean
```

This will delete the `~/Workshop/my-first-localnet/localnet` folder. Note that the configuration file (e.g. `localnet.toml`) will not be deleted automatically.

# 6. Create transactions

There are two ways to create a transaction: using the `newTransaction` function or using the create transaction from ABI using the `@multiversx/sdk-core` library.

## 6.1. `newTransaction` function

This function is used to create a valid transaction that can be used to be signed and sent.

The input of this function is an object with the following properties:

```typescript
export interface IPlainTransactionObject {
    nonce: number;
    value: string;
    receiver: string;
    sender: string;
    receiverUsername?: string;
    senderUsername?: string;
    guardian?: string;
    gasPrice: number;
    gasLimit: number;
    data?: string;
    chainID: string;
    version: number;
    options?: number;
    signature?: string;
    guardianSignature?: string;
}
```

The result of this function is a `Transaction` object, type defined in `@multiversx/sdk-core` package.

```typescript
import { newTransaction } from '@multiversx/sdk-dapp/models/newTransaction';
import { parseAmount } from '@multiversx/sdk-dapp/utils/operations/parseAmount';
import { TokenTransfer } from '@multiversx/sdk-core';

const value: TokenTransfer.egldFromAmount('0.01').toString();

const nonSignedTransaction = {
    value,
    data: "",
    receiver: address,
    sender: address
};

const preparedTransactionToBeSigned = newTransaction(nonSignedTransaction);

const signedTransaction = {
    value,
    data: "",
    receiver: address,
    sender: address,
    signature: "ssakjddkajkajwiji2iji2123kksjkdjks",
};

const preparedTransactionToBeSent = newTransaction(signedTransaction);
```

## 6.2. Create transaction from ABI

```typescript
import json from 'contracts/ping-pong.abi.json';
import { Address, SmartContract, AbiRegistry } from '@multiversx/sdk-core';

const contractAddress = 'erd1qqqqqqqqqqqqqpgq72l6vl07fkn3alyfq753mcy4nakm0l72396qkcud5x'; // The address of the smart contract
const abi = AbiRegistry.create(json);

export const smartContract = new SmartContract({
  address: new Address(contractAddress),
  abi
});

const pingTransaction = smartContract.methodsExplicit
    .ping() // The name of the function from the ABI
    .withValue('0')
    .withGasLimit(60000000)
    .withChainID(getChainId())
    .buildTransaction()
    .toPlainObject();

const pongTransaction = smartContract.methodsExplicit
    .pong() // The name of the function from the ABI
    .withValue('0')
    .withGasLimit(60000000)
    .withChainID(getChainId())
    .buildTransaction()
    .toPlainObject();
```
These transactions can be used to be signed and sent.
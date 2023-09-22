#!/usr/bin/env node

const { Command } = require("commander");
const { Transaction, Address, GasEstimator, TransferTransactionsFactory, TokenTransfer } = require("@multiversx/sdk-core");
const { AppBase } = require("./shared");
const { CHAIN_ID } = require("./config");

async function main() {
    const app = new App();
    const cli = new Command();

    cli
        .command("transfer-egld")
        .requiredOption("--receiver <string>")
        .requiredOption("--amount <string>", "in atomic units of the native token (EGLD) ")
        .requiredOption("--wallet <string>")
        .action(app.transferEGLD.bind(app));

    cli
        .command("transfer-esdt")
        .requiredOption("--receiver <string>")
        .requiredOption("--token <string>")
        .requiredOption("--amount <string>", "in atomic units of the custom token (must be 1 for NFTs)")
        .requiredOption("--wallet <string>")
        .action(app.transferESDT.bind(app));

    cli
        .command("get-balances")
        .requiredOption("--address <string>")
        .action(app.getBalances.bind(app));

    cli.parse(process.argv);
}

class App extends AppBase {
    async transferEGLD(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const senderAddress = signer.getAddress();
        const senderNonce = await this.recallAccountNonce(senderAddress);
        const receiverAddress = Address.fromBech32(cmdObj.receiver);
        const amount = cmdObj.amount;

        const transaction = new Transaction({
            nonce: senderNonce,
            value: amount,
            sender: senderAddress,
            receiver: receiverAddress,
            gasLimit: 50000,
            chainID: CHAIN_ID
        });

        await this.signTransaction(transaction, signer);
        await this.broadcastTransaction(transaction);
    }

    async transferESDT(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const senderAddress = signer.getAddress();
        const senderNonce = await this.recallAccountNonce(senderAddress);
        const receiverAddress = Address.fromBech32(cmdObj.receiver);
        const tokenIdentifier = cmdObj.token;
        const amount = cmdObj.amount;

        const transaction = this.createCustomTokenTransferTransaction({
            senderAddress,
            senderNonce,
            receiverAddress,
            tokenIdentifier,
            amount
        });

        await this.signTransaction(transaction, signer);
        await this.broadcastTransaction(transaction);
    }

    // Writing such a helper function will greatly improve in upcoming versions (see the new "mx-sdk-specs").
    createCustomTokenTransferTransaction({
        senderAddress,
        senderNonce,
        receiverAddress,
        tokenIdentifier,
        amount
    }) {
        // In upcoming versions, another factory object will be used.
        const factory = new TransferTransactionsFactory(new GasEstimator());

        // In upcoming versions, this operation will be supported by a helper object.
        const [_ticker, _randomPart, encodedNonce] = tokenIdentifier.split("-");
        const tokenNonce = parseInt(encodedNonce, 16);
        const isFungible = isNaN(tokenNonce);

        const tokenTransfer = new TokenTransfer({
            tokenIdentifier: tokenIdentifier,
            nonce: tokenNonce,
            amountAsBigInteger: amount
        });

        // In upcoming versions, the factory will be able to automatically infer the transaction type.
        if (isFungible) {
            return factory.createESDTTransfer({
                tokenTransfer: tokenTransfer,
                nonce: senderNonce,
                sender: senderAddress,
                receiver: receiverAddress,
                chainID: CHAIN_ID
            });
        }

        return factory.createESDTNFTTransfer({
            tokenTransfer: tokenTransfer,
            nonce: senderNonce,
            sender: senderAddress,
            receiver: receiverAddress,
            chainID: CHAIN_ID
        });
    }

    async getBalances(cmdObj) {
        const address = Address.fromBech32(cmdObj.address);

        const account = await this.networkProvider.getAccount(address);
        const tokens = await this.networkProvider.getFungibleTokensOfAccount(address);
        const nfts = await this.networkProvider.getNonFungibleTokensOfAccount(address);

        console.log(`EGLD balance (atomic units): ${account.balance}`);

        console.log("Fungible tokens (atomic units):")

        for (const token of tokens) {
            console.log(` - ${token.identifier}: ${token.balance}`);
        }

        console.log("Non-fungible tokens (including SFT and MetaESDT, in atomic units):")

        for (const token of nfts) {
            console.log(` - ${token.identifier}: ${token.balance}`);
        }
    }
}

(async () => {
    await main();
})();

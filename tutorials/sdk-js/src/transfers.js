#!/usr/bin/env node

const { Command } = require("commander");
const { Address, Token, TokenComputer, TokenTransfer } = require("@multiversx/sdk-core");
const { AppBase } = require("./shared");
const { EXPLORER_URL } = require("./config");

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
        .command("transfer-egld-using-factory")
        .requiredOption("--receiver <string>")
        .requiredOption("--amount <string>", "in atomic units of the native token (EGLD) ")
        .requiredOption("--wallet <string>")
        .action(app.transferEGLDUsingFactory.bind(app));

    cli
        .command("transfer-esdt")
        .requiredOption("--receiver <string>")
        .requiredOption("--token <string>")
        .requiredOption("--amount <string>", "in atomic units of the custom token (must be 1 for NFTs)")
        .requiredOption("--wallet <string>")
        .action(app.transferESDT.bind(app));


    cli
        .command("transfer-esdt-using-factory")
        .requiredOption("--receiver <string>")
        .requiredOption("--token <string>")
        .requiredOption("--amount <string>", "in atomic units of the custom token (must be 1 for NFTs)")
        .requiredOption("--wallet <string>")
        .action(app.transferESDTUsingFactory.bind(app));

    cli
        .command("get-balances")
        .requiredOption("--address <string>")
        .action(app.getBalances.bind(app));

    cli.parse(process.argv);
}

class App extends AppBase {
    async transferEGLD(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        const receiverAddress = Address.newFromBech32(cmdObj.receiver);
        const amount = cmdObj.amount;

        const transferController = this.entrypoint.createTransfersController();
        const transaction = await transferController.createTransactionForNativeTokenTransfer(sender, senderNonce,
            {
                receiver: receiverAddress,
                nativeAmount: amount,
            });

        const transactionHash = await this.entrypoint.sendTransaction(transaction);
        console.log(`Transaction hash: ${transactionHash}`);
        console.log(`See it on Explorer: ${EXPLORER_URL}/transactions/${transactionHash}`);
    }

    async transferEGLDUsingFactory(cmdObj) {
        const senderAccount = await this.loadAccount(cmdObj.wallet);
        const senderAddress = senderAccount.address;
        const senderNonce = await this.entrypoint.recallAccountNonce(senderAddress);
        const receiverAddress = Address.newFromBech32(cmdObj.receiver);
        const amount = cmdObj.amount;

        const transferFactory = this.entrypoint.createTransfersTransactionsFactory();
        const transaction = await transferFactory.createTransactionForNativeTokenTransfer(senderAddress,
            {
                receiver: receiverAddress,
                nativeAmount: amount,
            });

        transaction.nonce = senderNonce;
        transaction.signature = await senderAccount.signTransaction(transaction);

        const transactionHash = await this.entrypoint.sendTransaction(transaction);
        console.log(`Transaction hash: ${transactionHash}`);
        console.log(`See it on Explorer: ${EXPLORER_URL}/transactions/${transactionHash}`);
    }

    async transferESDT(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        const receiverAddress = Address.newFromBech32(cmdObj.receiver);
        const amount = cmdObj.amount;

        const tokenComputer = new TokenComputer();
        const tokenIdentifier = tokenComputer.extractIdentifierFromExtendedIdentifier(cmdObj.token);
        const tokenNonce = tokenComputer.extractNonceFromExtendedIdentifier(cmdObj.token);

        const token = new Token({ identifier: tokenIdentifier, nonce: tokenNonce });
        const transfer = new TokenTransfer({ token: token, amount: amount });

        const transferController = this.entrypoint.createTransfersController();
        const transaction = await transferController.createTransactionForEsdtTokenTransfer(sender, senderNonce,
            {
                receiver: receiverAddress,
                tokenTransfers: [transfer],
            });


        const transactionHash = await this.entrypoint.sendTransaction(transaction);
        console.log(`Transaction hash: ${transactionHash}`);
        console.log(`See it on Explorer: ${EXPLORER_URL}/transactions/${transactionHash}`);
    }

    async transferESDTUsingFactory(cmdObj) {
        const senderAccount = await this.loadAccount(cmdObj.wallet);
        const senderAddress = senderAccount.address;
        const senderNonce = await this.entrypoint.recallAccountNonce(senderAddress);
        const receiverAddress = Address.newFromBech32(cmdObj.receiver);
        const amount = cmdObj.amount;

        const tokenComputer = new TokenComputer();
        const tokenIdentifier = tokenComputer.extractIdentifierFromExtendedIdentifier(cmdObj.token);
        const tokenNonce = tokenComputer.extractNonceFromExtendedIdentifier(cmdObj.token);

        const token = new Token({ identifier: tokenIdentifier, nonce: tokenNonce });
        const transfer = new TokenTransfer({ token: token, amount: amount });
        const transferFactory = this.entrypoint.createTransfersTransactionsFactory();
        const transaction = await transferFactory.createTransactionForESDTTokenTransfer(senderAddress,
            {
                receiver: receiverAddress,
                tokenTransfers: [transfer],
            });

        transaction.nonce = senderNonce;
        transaction.signature = await senderAccount.signTransaction(transaction);

        const transactionHash = await this.entrypoint.sendTransaction(transaction);
        console.log(`Transaction hash: ${transactionHash}`);
        console.log(`See it on Explorer: ${EXPLORER_URL}/transactions/${transactionHash}`);
    }

    async getBalances(cmdObj) {
        const address = Address.newFromBech32(cmdObj.address);

        const account = await this.provider.getAccount(address);
        const tokens = await this.provider.getFungibleTokensOfAccount(address);
        const nfts = await this.provider.getNonFungibleTokensOfAccount(address);

        console.log(`EGLD balance (atomic units): ${account.balance}`);

        console.log("Fungible tokens (atomic units):");

        for (const token of tokens) {
            console.log(` - ${token.token.identifier}: ${token.amount}`);
        }

        console.log("Non-fungible tokens (including SFT and MetaESDT, in atomic units):");

        for (const token of nfts) {
            console.log(` - ${token.token.identifier}: ${token.amount}`);
        }
    }
}

(async () => {
    await main();
})();

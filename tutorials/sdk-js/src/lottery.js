#!/usr/bin/env node

const { Command } = require("commander");
const { Address, BytesValue, Token, TokenComputer, TokenTransfer, TransactionsFactoryConfig, SmartContractTransactionsOutcomeParser, SmartContractTransactionsFactory } = require("@multiversx/sdk-core");
const { ContractAppBase } = require("./shared");

// Contract: https://github.com/multiversx/mx-contracts-rs/blob/main/contracts/lottery-esdt/src/lottery.rs.
// Documentation: https://github.com/multiversx/mx-contracts-rs/blob/main/contracts/lottery-esdt/documentation.md.
// Built bytecode: https://github.com/multiversx/mx-contracts-rs/releases/download/v0.45.5/lottery-esdt.wasm.
// ABI: https://github.com/multiversx/mx-contracts-rs/releases/download/v0.45.5/lottery-esdt.abi.json
// For the "lottery-esdt" example, we will be using the ABI.

async function main() {
    const app = new App();
    const cli = new Command();

    cli
        .command("deploy")
        .requiredOption("--wallet <string>")
        .action(app.deployContract.bind(app));

    cli
        .command("start")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .requiredOption("--token <string>")
        .requiredOption("--price <string>", "in atomic units of the custom token")
        .requiredOption("--duration <number>", "in seconds")
        .requiredOption("--wallet <string>")
        .action(app.startLottery.bind(app));

    cli
        .command("get-info")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .action(app.getLotteryInfo.bind(app));

    cli
        .command("buy-ticket")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .requiredOption("--token <string>")
        .requiredOption("--amount <string>", "in atomic units of the custom token")
        .requiredOption("--wallet <string>")
        .action(app.buyTicket.bind(app));

    cli
        .command("buy-ticket-using-factory")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .requiredOption("--token <string>")
        .requiredOption("--amount <string>", "in atomic units of the custom token")
        .requiredOption("--wallet <string>")
        .action(app.buyTicketUsingFactory.bind(app));

    cli
        .command("determine-winner")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .requiredOption("--wallet <string>")
        .action(app.determineWinner.bind(app));

    cli.parse(process.argv);
}

class App extends ContractAppBase {
    async deployContract(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        const code = await this.loadContractCode("contracts/lottery-esdt.wasm");

        const smartContractController = this.entrypoint.createSmartContractController();
        const deployTransaction = await smartContractController.createTransactionForDeploy(sender, senderNonce, {
            bytecode: code,
            gasLimit: 60000000n,
            arguments: [],
        });

        const txHash = await this.entrypoint.sendTransaction(deployTransaction);
        const outcome = await smartContractController.awaitCompletedDeploy(txHash);
        const contractAddress = outcome.contracts[0].address;
        console.log(`Contract deployed at address ${contractAddress}`);
    }

    async startLottery(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        sender.nonce = senderNonce;
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;
        const lotteryTokenIdentifier = cmdObj.token;
        const ticketPrice = cmdObj.price;
        const duration = parseInt(cmdObj.duration);
        const currentTimestamp = Math.floor((new Date()).getTime() / 1000);

        const smartContractController = this.entrypoint.createSmartContractController(abi);
        const transaction = await smartContractController.createTransactionForExecute(sender, senderNonce, {
            contract: contractAddress,
            gasLimit: 5000000,
            function: "start",
            arguments: [lotteryName, lotteryTokenIdentifier, ticketPrice, null, currentTimestamp + duration, null, null, null, null],
        });

        const txHash = await this.entrypoint.sendTransaction(transaction);
        const outcome = await smartContractController.awaitCompletedExecute(txHash);
        console.log({ outcome });
    }

    async getLotteryInfo(cmdObj) {
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;

        const smartContractController = this.entrypoint.createSmartContractController(abi);

        const queryResponse = await smartContractController.query({
            contract: contractAddress,
            function: "getLotteryInfo",
            arguments: [BytesValue.fromUTF8(lotteryName)],
        });

        console.log(`Lottery info:`);
        console.log({ queryResponse: JSON.stringify(queryResponse, null, 4) });
    }

    async buyTicket(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        sender.nonce = senderNonce;
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;
        const tokenAmount = cmdObj.amount;
        const tokenComputer = new TokenComputer();
        const tokenIdentifier = tokenComputer.extractIdentifierFromExtendedIdentifier(cmdObj.token);
        const tokenNonce = tokenComputer.extractNonceFromExtendedIdentifier(cmdObj.token);

        const token = new Token({ identifier: tokenIdentifier, nonce: tokenNonce });
        const transfer = new TokenTransfer({ token: token, amount: tokenAmount });
        const smartContractController = this.entrypoint.createSmartContractController(abi);
        const transaction = await smartContractController.createTransactionForExecute(sender, senderNonce, {
            contract: contractAddress,
            gasLimit: 5000000,
            function: "buy_ticket",
            arguments: [lotteryName],
            tokenTransfers: [transfer]
        });

        const txHash = await this.entrypoint.sendTransaction(transaction);
        const outcome = await smartContractController.awaitCompletedExecute(txHash);

        console.log({ outcome });
    }

    async buyTicketUsingFactory(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderAddress = sender.address;
        const senderNonce = await this.entrypoint.recallAccountNonce(senderAddress);
        sender.nonce = senderNonce;
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;
        const tokenAmount = cmdObj.amount;
        const tokenComputer = new TokenComputer();
        const tokenIdentifier = tokenComputer.extractIdentifierFromExtendedIdentifier(cmdObj.token);
        const tokenNonce = tokenComputer.extractNonceFromExtendedIdentifier(cmdObj.token);
        const parser = new SmartContractTransactionsOutcomeParser({ abi: abi });

        const token = new Token({ identifier: tokenIdentifier, nonce: tokenNonce });
        const transfer = new TokenTransfer({ token: token, amount: tokenAmount });
        const smartContractFactory = new SmartContractTransactionsFactory({ abi: abi, config: new TransactionsFactoryConfig({ chainID: "D" }) });
        const transaction = smartContractFactory.createTransactionForExecute(senderAddress, {
            contract: contractAddress,
            gasLimit: 5000000,
            function: "buy_ticket",
            arguments: [lotteryName],
            tokenTransfers: [transfer]
        });

        transaction.nonce = senderNonce;
        transaction.signature = await sender.signTransaction(transaction);

        const txHash = await this.entrypoint.sendTransaction(transaction);
        let transactionOnNetwork = await this.entrypoint.getTransaction(txHash);
        let response = parser.parseExecute({ transactionOnNetwork, function: "buy_ticket" });

        console.log({ response });
    }

    async determineWinner(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        sender.nonce = senderNonce;
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;

        const smartContractController = this.entrypoint.createSmartContractController(abi);
        const transaction = await smartContractController.createTransactionForExecute(sender, senderNonce, {
            contract: contractAddress,
            gasLimit: 5000000,
            function: "determine_winner",
            arguments: [lotteryName],
        });

        const txHash = await this.entrypoint.sendTransaction(transaction);
        const outcome = await smartContractController.awaitCompletedExecute(txHash);

        console.log({ outcome });
    }
}

(async () => {
    await main();
})();

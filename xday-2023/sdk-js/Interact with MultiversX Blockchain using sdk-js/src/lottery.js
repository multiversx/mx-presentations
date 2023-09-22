#!/usr/bin/env node

const { Command } = require("commander");
const { Address, SmartContract, TokenTransfer } = require("@multiversx/sdk-core");
const { ContractAppBase } = require("./shared");
const { CHAIN_ID } = require("./config");

// Contract: https://github.com/multiversx/mx-sdk-rs/blob/master/contracts/examples/lottery-esdt/src/lottery.rs.
// Documentation: https://github.com/multiversx/mx-sdk-rs/blob/master/contracts/examples/lottery-esdt/documentation.md.
// Built bytecode: https://github.com/multiversx/mx-reproducible-contract-build-example-sc/releases/download/v0.4.4/lottery-esdt.wasm.
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
        .command("determine-winner")
        .requiredOption("--contract <string>")
        .requiredOption("--name <string>")
        .requiredOption("--wallet <string>")
        .action(app.determineWinner.bind(app));

    cli.parse(process.argv);
}

class App extends ContractAppBase {
    async deployContract(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const deployerAddress = signer.getAddress();
        const deployerNonce = await this.recallAccountNonce(deployerAddress);
        const code = await this.loadContractCode("contracts/lottery-esdt.wasm");

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract();
        const deployTransaction = contract.deploy({
            deployer: deployerAddress,
            code: code,
            initArguments: [],
            gasLimit: 50000000,
            chainID: CHAIN_ID
        });

        deployTransaction.setNonce(deployerNonce);

        await this.signTransaction(deployTransaction, signer);
        await this.broadcastTransaction(deployTransaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(deployTransaction);
        const { contractAddress } = this.parseDeployOutcome(transactionOnNetwork);
        console.log(`Contract deployed at address ${contractAddress}`)
    }

    async startLottery(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const callerAddress = signer.getAddress();
        const callerNonce = await this.recallAccountNonce(callerAddress);
        const contractAddress = Address.fromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;
        const lotteryTokenIdentifier = cmdObj.token;
        const ticketPrice = cmdObj.price;
        const duration = parseInt(cmdObj.duration);
        const currentTimestamp = Math.floor((new Date()).getTime() / 1000);

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract({ address: contractAddress, abi: abi });

        // We are using the "interactions" API (contract.methods).
        // "mx-sdk-specs" already define a replacement for the "interactions" API (soon to become available in "sdk-js").
        // Given the ABI, automatic type inference takes place.
        const transaction = contract.methods.start(
            [
                lotteryName,
                lotteryTokenIdentifier,
                ticketPrice, // Yes, this is a string and automatically gets converted to a BigUIntValue.
                null, // opt_total_tickets
                currentTimestamp + duration, // opt_deadline
                null, // opt_max_entries_per_user
                null, // opt_prize_distribution
                null, // opt_whitelist
            ])
            .withSender(callerAddress)
            .withGasLimit(5000000)
            .withNonce(callerNonce)
            .withChainID(CHAIN_ID)
            .buildTransaction();

        await this.signTransaction(transaction, signer);
        await this.broadcastTransaction(transaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(transaction);

        const outcome = this.resultsParser.parseUntypedOutcome(transactionOnNetwork);
        this.assertSuccessfulOutcome(outcome);
    }

    async getLotteryInfo(cmdObj) {
        const contractAddress = Address.fromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract({ address: contractAddress, abi: abi });

        // We are using the "interactions" API (contract.methods).
        const query = contract.methods.getLotteryInfo([lotteryName]).buildQuery();
        const queryResponse = await this.networkProvider.queryContract(query);
        const outcome = this.resultsParser.parseQueryResponse(queryResponse, abi.getEndpoint("getLotteryInfo"));
        this.assertSuccessfulOutcome(outcome);

        const lotteryInfo = outcome.values[0].valueOf();
        console.log(`Lottery info:`);
        console.log(JSON.stringify(lotteryInfo, null, 4));
    }

    async buyTicket(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const callerAddress = signer.getAddress();
        const callerNonce = await this.recallAccountNonce(callerAddress);
        const contractAddress = Address.fromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;
        const tokenIdentifier = cmdObj.token;
        const tokenAmount = cmdObj.amount;

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract({ address: contractAddress, abi: abi });

        // We are using the "interactions" API (contract.methods).
        // "mx-sdk-specs" already define a replacement for the "interactions" API (soon to become available in "sdk-js").
        // Given the ABI, automatic type inference takes place.
        const transaction = contract.methods.buy_ticket(
            [
                lotteryName,
            ])
            // Transfer & execute: this gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
            .withSingleESDTTransfer(new TokenTransfer({ tokenIdentifier, amountAsBigInteger: tokenAmount }))
            .withSender(callerAddress)
            .withGasLimit(5000000)
            .withNonce(callerNonce)
            .withChainID(CHAIN_ID)
            .buildTransaction();

        await this.signTransaction(transaction, signer);
        await this.broadcastTransaction(transaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(transaction);

        const outcome = this.resultsParser.parseUntypedOutcome(transactionOnNetwork);
        this.assertSuccessfulOutcome(outcome);
    }

    async determineWinner(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const callerAddress = signer.getAddress();
        const callerNonce = await this.recallAccountNonce(callerAddress);
        const contractAddress = Address.fromBech32(cmdObj.contract);
        const abi = await this.loadContractAbi("contracts/lottery-esdt.abi.json");
        const lotteryName = cmdObj.name;

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract({ address: contractAddress, abi: abi });

        const transaction = contract.methods.determine_winner(
            [
                lotteryName,
            ])
            .withSender(callerAddress)
            .withGasLimit(5000000)
            .withNonce(callerNonce)
            .withChainID(CHAIN_ID)
            .buildTransaction();

        await this.signTransaction(transaction, signer);
        await this.broadcastTransaction(transaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(transaction);

        const outcome = this.resultsParser.parseUntypedOutcome(transactionOnNetwork);
        this.assertSuccessfulOutcome(outcome);
    }
}

(async () => {
    await main();
})();

#!/usr/bin/env node

const { Command } = require("commander");
const { Address, SmartContract, BigUIntValue, BinaryCodec, BigUIntType } = require("@multiversx/sdk-core");
const { ContractAppBase } = require("./shared");
const { CHAIN_ID } = require("./config");

// Contract: https://github.com/multiversx/mx-sdk-rs/blob/master/contracts/examples/adder/src/adder.rs.
// Built bytecode: https://github.com/multiversx/mx-reproducible-contract-build-example-sc/releases/download/v0.4.3/adder.wasm.
// For the "adder" example, we will not be using an ABI.
async function main() {
    const app = new App();
    const cli = new Command();

    cli
        .command("deploy")
        .requiredOption("--initial-value <number>")
        .requiredOption("--wallet <string>")
        .action(app.deployContract.bind(app));

    cli
        .command("add")
        .requiredOption("--contract <string>")
        .requiredOption("--value <number>")
        .requiredOption("--wallet <string>")
        .action(app.addValue.bind(app));

    cli
        .command("get-sum")
        .requiredOption("--contract <string>")
        .action(app.getSum.bind(app));

    cli.parse(process.argv);
}

class App extends ContractAppBase {
    async deployContract(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const deployerAddress = signer.getAddress();
        const deployerNonce = await this.recallAccountNonce(deployerAddress);
        const code = await this.loadContractCode("contracts/adder.wasm");
        const initialValue = cmdObj.initialValue;

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract();

        const deployTransaction = contract.deploy({
            deployer: deployerAddress,
            code: code,
            initArguments: [new BigUIntValue(initialValue)],
            gasLimit: 20000000,
            chainID: CHAIN_ID
        });

        deployTransaction.setNonce(deployerNonce);

        await this.signTransaction(deployTransaction, signer);
        await this.broadcastTransaction(deployTransaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(deployTransaction);
        const { contractAddress } = this.parseDeployOutcome(transactionOnNetwork);
        console.log(`Contract deployed at address ${contractAddress}`);
    }

    async addValue(cmdObj) {
        const signer = await this.loadSigner(cmdObj.wallet);
        const callerAddress = signer.getAddress();
        const callerNonce = await this.recallAccountNonce(callerAddress);
        const contractAddress = Address.fromBech32(cmdObj.contract);
        const value = cmdObj.value;

        // This gets improved in the upcoming version of "sdk-core" (see "mx-sdk-specs").
        const contract = new SmartContract({ address: contractAddress });

        const callTransaction = contract.call({
            caller: callerAddress,
            func: "add",
            args: [new BigUIntValue(value)],
            gasLimit: 5000000,
            chainID: CHAIN_ID
        });

        callTransaction.setNonce(callerNonce);

        await this.signTransaction(callTransaction, signer);
        await this.broadcastTransaction(callTransaction);
        const transactionOnNetwork = await this.awaitTransactionCompletion(callTransaction);

        const outcome = this.resultsParser.parseUntypedOutcome(transactionOnNetwork);
        this.assertSuccessfulOutcome(outcome);
    }

    async getSum(cmdObj) {
        const contractAddress = Address.fromBech32(cmdObj.contract);

        const contract = new SmartContract({ address: contractAddress });
        const query = contract.createQuery({ func: "getSum", args: [] });
        const queryResponse = await this.networkProvider.queryContract(query);

        const outcome = this.resultsParser.parseUntypedQueryResponse(queryResponse);
        this.assertSuccessfulOutcome(outcome);

        const sumEncoded = outcome.values[0];
        const sumDecoded = new BinaryCodec().decodeTopLevel(sumEncoded, new BigUIntType());
        console.log(`Sum: ${sumDecoded.valueOf().toFixed(0)}`);
    }
}

(async () => {
    await main();
})();

#!/usr/bin/env node

const { Command } = require("commander");
const { Address, BigUIntValue, decodeUnsignedNumber, U32Value } = require("@multiversx/sdk-core");
const { ContractAppBase } = require("./shared");

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
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        const code = await this.loadContractCode("contracts/adder.wasm");

        const smartContractController = this.entrypoint.createSmartContractController();
        const deployTransaction = await smartContractController.createTransactionForDeploy(sender, senderNonce, {
            bytecode: code,
            gasLimit: 20000000n,
            arguments: [new U32Value(1)],
        });

        const txHash = await this.entrypoint.sendTransaction(deployTransaction);
        const response = await smartContractController.awaitCompletedDeploy(txHash);
        const contractAddress = response.contracts[0].address;
        console.log(`Contract deployed at address ${contractAddress}`);
    }

    async addValue(cmdObj) {
        const sender = await this.loadAccount(cmdObj.wallet);
        const senderNonce = await this.entrypoint.recallAccountNonce(sender.address);
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const value = cmdObj.value;

        const smartContractController = this.entrypoint.createSmartContractController();
        const transaction = await smartContractController.createTransactionForExecute(sender, senderNonce, {
            contract: contractAddress,
            gasLimit: 5000000,
            function: "add",
            arguments: [new BigUIntValue(value)],
        });

        const txHash = await this.entrypoint.sendTransaction(transaction);
        const outcome = await smartContractController.awaitCompletedExecute(txHash);
        console.log(`Transaction executed with success:  ${outcome.returnCode}`);
    }

    async getSum(cmdObj) {
        const contractAddress = Address.newFromBech32(cmdObj.contract);
        const smartContractController = this.entrypoint.createSmartContractController();

        const queryResult = await smartContractController.query({ contract: contractAddress, function: "getSum", arguments: [] });

        console.log(`Sum: ${decodeUnsignedNumber(queryResult[0])}`);
    }
}

(async () => {
    await main();
})();

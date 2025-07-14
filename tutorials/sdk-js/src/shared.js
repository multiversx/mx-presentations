const os = require("os");
const fs = require("fs");
const read = require("read");
const { Account, DevnetEntrypoint, SmartContractTransactionsOutcomeParser, TransactionWatcher, Code, UserSigner } = require("@multiversx/sdk-core");
const { Abi } = require("@multiversx/sdk-core/out/abi");

class AppBase {
    constructor() {
        this.entrypoint = new DevnetEntrypoint();
        this.provider = this.entrypoint.createNetworkProvider();
        this.factory = this.entrypoint.createSmartContractTransactionsFactory();
        this.transactionWatcher = new TransactionWatcher(this.networkProvider, { patienceMilliseconds: 8000 });
        this.parser = new SmartContractTransactionsOutcomeParser();
    }
    // We load a signer object from a JSON wallet file.
    async loadAccount(walletPath) {
        const resolvedPath = walletPath.replace("~", os.homedir);
        const walletJson = await fs.promises.readFile(resolvedPath, { encoding: "utf8" });
        const walletObject = JSON.parse(walletJson);
        const password = await this.askWalletPassword();
        const userSigner = UserSigner.fromWallet(walletObject, password);
        return new Account(userSigner.secretKey);
    }

    async askWalletPassword() {
        return await read({ prompt: "Wallet password: ", silent: true });
    }

    async broadcastTransaction(transaction) {
        // Performs a POST request against the API.
        const transactionHash = await this.entrypoint.sendTransaction(transaction);
        console.log(`Transaction hash: ${transactionHash}`);
        console.log(`See it on Explorer: ${EXPLORER_URL}/transactions/${transactionHash}`);
    }

    async awaitTransactionCompletion(transaction) {
        console.log("Waiting for transaction to be completely processed...");
        return await this.transactionWatcher.awaitCompleted(transaction);
    }
}

class ContractAppBase extends AppBase {
    constructor() {
        super();
    }

    async loadContractCode(bytecodePath) {
        const bytecode = await fs.promises.readFile(bytecodePath);
        return Code.fromBuffer(bytecode);
    }

    async loadContractAbi(abiPath) {
        const abiJson = await fs.promises.readFile(abiPath, { encoding: "utf8" });
        const abiObj = JSON.parse(abiJson);
        const abiRegistry = Abi.create(abiObj);
        return abiRegistry;
    }


    assertSuccessfulOutcome({ returnCode, returnMessage }) {
        if (!returnCode.isSuccess()) {
            console.error(`Operation failed: return code = ${returnCode}, message = ${returnMessage}`);
            process.exit(1);
        }
    }
}

module.exports = {
    AppBase,
    ContractAppBase
};


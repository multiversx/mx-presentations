const os = require("os");
const fs = require("fs");
const read = require("read");
const { UserSigner } = require("@multiversx/sdk-wallet");
const { Address, Code, TransactionWatcher, ResultsParser, AbiRegistry } = require("@multiversx/sdk-core");
const { ApiNetworkProvider } = require("@multiversx/sdk-network-providers");
const { API_URL, EXPLORER_URL } = require("./config");

class AppBase {
    constructor() {
        this.networkProvider = new ApiNetworkProvider(API_URL, { timeout: 10000 });
        this.transactionWatcher = new TransactionWatcher(this.networkProvider, { patienceMilliseconds: 8000 });
    }

    // We load a signer object from a JSON wallet file.
    async loadSigner(walletPath) {
        const resolvedPath = walletPath.replace("~", os.homedir);
        const walletJson = await fs.promises.readFile(resolvedPath, { encoding: "utf8" });
        const walletObject = JSON.parse(walletJson);
        const password = await this.askWalletPassword();
        return UserSigner.fromWallet(walletObject, password);
    }

    async askWalletPassword() {
        return await read({ prompt: "Wallet password: ", silent: true });
    }

    // All transactions must hold the nonce of the sender account.
    async recallAccountNonce(address) {
        // Performs a GET request against the API.
        const accountOnNetwork = await this.networkProvider.getAccount(address);
        return accountOnNetwork.nonce;
    }

    async signTransaction(transaction, signer) {
        const serializedTransaction = transaction.serializeForSigning();
        const transactionSignature = await signer.sign(serializedTransaction);
        transaction.applySignature(transactionSignature);
    }

    async broadcastTransaction(transaction) {
        // Performs a POST request against the API.
        const transactionHash = await this.networkProvider.sendTransaction(transaction);
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
        this.resultsParser = new ResultsParser();
    }

    async loadContractCode(bytecodePath) {
        const bytecode = await fs.promises.readFile(bytecodePath);
        return Code.fromBuffer(bytecode);
    }

    async loadContractAbi(abiPath) {
        const abiJson = await fs.promises.readFile(abiPath, { encoding: "utf8" });
        const abiObj = JSON.parse(abiJson);
        const abiRegistry = AbiRegistry.create(abiObj);
        return abiRegistry;
    }

    parseDeployOutcome(transactionOnNetwork) {
        const outcome = this.resultsParser.parseUntypedOutcome(transactionOnNetwork);
        this.assertSuccessfulOutcome(outcome);

        const scDeployEvent = transactionOnNetwork.logs.findSingleOrNoneEvent("SCDeploy");
        const firstTopic = scDeployEvent.topics[0];
        const contractAddress = Address.fromHex(firstTopic.hex());
        return { contractAddress };
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

const os = require("os");
const fs = require("fs");
const read = require("read");
const { Account, DevnetEntrypoint, Code, UserSigner } = require("@multiversx/sdk-core");
const { Abi } = require("@multiversx/sdk-core/out/abi");

class AppBase {
    constructor() {
        this.entrypoint = new DevnetEntrypoint();
        this.provider = this.entrypoint.createNetworkProvider();
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
}

module.exports = {
    AppBase,
    ContractAppBase
};


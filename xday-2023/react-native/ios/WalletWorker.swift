//
//  WalletWorker.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import WalletCore

enum WalletError: String, Error {
  case failedToGetPassword
  case noWalletFound
  case invalidInput
  case somethingWentWrong
  case noDefaultWallet
}

protocol WalletProtocol {
  func createWallet(for password: WalletPassword,
                    and name: WalletName) async throws -> MultiversXWallet
  
  func importWallet(for mnemonic: WalletSecretPhrase,
                    name: WalletName,
                    and password: WalletPassword) async throws -> MultiversXWallet
  
  func deleteWallet(for identifier: WalletIdentifier) async throws
  func deleteAllWallets() async throws
  func exportMnemonic(for identifier: WalletIdentifier) async throws -> String
  func getPrivateKey(for identifier: WalletIdentifier) async throws -> PrivateKey
  
}

actor WalletWorker {
  
  // MARK: - Private vars
  
  private let keyStore: KeyStore
  private let walletStore: WalletStore
  private var wallets: [Wallet]
  private var privateKeysCache: [String: PrivateKey] = [:]
  
  // MARK: - Init
  
  init(walletStore: WalletStore) {
    let dataDir = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    let keysSubFolder = "/keystore"
    let keysDirectory = URL(fileURLWithPath: dataDir + keysSubFolder)
    
    self.walletStore = walletStore
    self.keyStore = try! KeyStore(keyDirectory: keysDirectory)
    self.wallets = keyStore.wallets
  }
  
}

// MARK: - Public API

extension WalletWorker: WalletProtocol {
  
  func createWallet(for password: WalletPassword,
                    and name: WalletName) throws -> MultiversXWallet {
    let hdWallet = try createHDWallet(with: password)
    
    return try importWallet(for: hdWallet.mnemonic,
                            name: name,
                            and: password)
  }
  
  func importWallet(for mnemonic: WalletSecretPhrase,
                    name: WalletName,
                    and password: WalletPassword) throws -> MultiversXWallet {
    let wallet = try keyStore.import(mnemonic: mnemonic,
                                     name: name,
                                     encryptPassword: password,
                                     coins: [.multiversX])
    updateWallets()
    
    walletStore.setPassword(password,
                            for: wallet.identifier)
    
    return try getMultiversXWallet(from: wallet)
  }
  
  func deleteWallet(for identifier: WalletIdentifier) throws {
    guard let password = walletStore.getPassword(for: identifier) else {
      throw WalletError.failedToGetPassword
    }
    
    let wallet = try getWalletFromKeyStore(for: identifier)
    
    try keyStore.delete(wallet: wallet,
                        password: password)
    updateWallets()
  }
  
  func deleteAllWallets() throws {
    for wallet in wallets {
      if let password = walletStore.getPassword(for: wallet.identifier) {
        try keyStore.delete(wallet: wallet, password: password)
      }
      
      try walletStore.deletePassword(for: wallet.identifier)
    }
    
    updateWallets()
  }
  
  func exportMnemonic(for identifier: WalletIdentifier) throws -> String {
    guard let password = walletStore.getPassword(for: identifier) else {
      throw WalletError.failedToGetPassword
    }
    
    let wallet = try getWalletFromKeyStore(for: identifier)
    
    return try keyStore.exportMnemonic(wallet: wallet,
                                       password: password)
  }
  
  func getPrivateKey(for identifier: WalletIdentifier) throws -> PrivateKey {
    let cacheKey = identifier + String(CoinType.multiversX.rawValue);
    
    if let cachedPrivateKey = privateKeysCache[cacheKey] {
      return cachedPrivateKey
    }
    
    guard let password = walletStore.getPassword(for: identifier) else {
      throw WalletError.failedToGetPassword
    }
    
    let wallet = try getWalletFromKeyStore(for: identifier)
    let privateKey = try wallet.privateKey(password: password,
                                           coin: .multiversX)
    
    privateKeysCache[cacheKey] = privateKey
    
    return privateKey
  }
  
}

// MARK: - Import private helpers

private extension WalletWorker {
  
  func importHDWallet(for wallet: Wallet,
                      and password: WalletPassword) throws -> HDWallet {
    guard let dataPassword = password.data(using: .utf8) else{
      throw WalletError.failedToGetPassword
    }
    
    let mnemonic = try keyStore.exportMnemonic(wallet: wallet,
                                               password: password)
    
    let storedKey = StoredKey.importHDWallet(mnemonic: mnemonic,
                                             name: "",
                                             password: dataPassword,
                                             coin: .multiversX)
    
    guard let storedKey = storedKey,
          let wallet = storedKey.wallet(password: dataPassword) else {
      throw WalletError.noWalletFound
    }
    
    return wallet
  }
  
}

// MARK: - Get wallet private helpers

private extension WalletWorker {
  
  func getWalletFromKeyStore(for identifier: WalletIdentifier) throws -> Wallet {
    guard let wallet = wallets.first(where: { $0.identifier == identifier}) else {
      throw WalletError.noWalletFound
    }
    
    return wallet
  }
  
  func getMultiversXWallet(from wallet: Wallet) throws -> MultiversXWallet {
    guard let password = walletStore.getPassword(for: wallet.identifier) else {
      throw WalletError.failedToGetPassword
    }
    
    let hdWallet = try importHDWallet(for: wallet,
                                      and: password)
    
    let accounts = wallet.accounts.compactMap {
      getMultiversXAccount(for: $0.coin, from: hdWallet)
    }
    
    return MultiversXWallet(identifier: wallet.identifier,
                            accounts: accounts,
                            creationDate: wallet.creationDate)
  }
  
  func getMultiversXAccount(for coin: CoinType,
                            from hdWallet: HDWallet) -> MultiversXAccount? {
    let address = hdWallet.getAddressForCoin(coin: coin)
    
    return MultiversXAccount(address: address,
                             coin: Int(coin.rawValue))
  }
  
}

// MARK: - Private helpers

private extension WalletWorker {
  
  func createHDWallet(with password: WalletPassword) throws -> HDWallet {
    guard let wallet = HDWallet(strength: 256, passphrase: password) else {
      throw WalletError.somethingWentWrong
    }
    
    return wallet
  }
  
  func updateWallets() {
    self.wallets = keyStore.wallets
  }
  
}

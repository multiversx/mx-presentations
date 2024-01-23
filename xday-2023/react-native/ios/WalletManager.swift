//
//  WalletManager.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import CryptoSwift
import Foundation

@objc(WalletManager)
class WalletManager: NSObject {
  
  // MARK: - Private vars
  
  private let walletWorker: WalletProtocol
  
  // MARK: - Init
  
  override init() {
    self.walletWorker = WalletWorker(walletStore: KeychainWorker())
  }
  
  // MARK: - RN methods
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }
  
}

// MARK: - Public API

extension WalletManager {
  
  @objc
  func generateNewWallet(_ name: String,
                         resolve: @escaping RCTPromiseResolveBlock,
                         reject: @escaping RCTPromiseRejectBlock) {
    Task.detached(priority: .userInitiated) {
      do {
        let wallet = try await self.generateNewWallet(for: name)
        CurrentWalletStore.id = wallet.identifier
        
        resolve(wallet.asDictionary())
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func importWallet(_ mnemonic: String,
                    name: String,
                    resolve: @escaping RCTPromiseResolveBlock,
                    reject: @escaping RCTPromiseRejectBlock) {
    Task.detached(priority: .userInitiated) {
      do {
        let wallet = try await self.importWallet(mnemonic: mnemonic,
                                                 name: name)
        CurrentWalletStore.id = wallet.identifier
        
        resolve(wallet.asDictionary())
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func signTransaction(_ transaction: NSDictionary,
                       resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
    guard let transaction = transaction as? [String: Any] else {
      reject(nil, nil, WalletError.invalidInput)
      return
    }
    
    Task.detached(priority: .userInitiated) {
      do {
        let walletIdentifier = try self.getCurrentWalletIdentifier()
        let inputTx = try self.decodeTransactionInputs(transaction: transaction)
        let signedTx = try await self.signTransaction(inputTx,
                                                      for: walletIdentifier)
        
        resolve(signedTx)
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func removeWallet(_ identifier: String,
                    resolve: @escaping RCTPromiseResolveBlock,
                    reject: @escaping RCTPromiseRejectBlock) {
    Task.detached(priority: .utility) {
      do {
        try await self.walletWorker.deleteWallet(for: identifier)
        CurrentWalletStore.id = nil
        resolve(())
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func removeAllWallets(_ resolve: @escaping RCTPromiseResolveBlock,
                        reject: @escaping  RCTPromiseRejectBlock) {
    Task.detached(priority: .utility) {
      do {
        try await self.walletWorker.deleteAllWallets()
        CurrentWalletStore.id = nil
        resolve(())
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func signMessage(_ message: String,
                   resolve: @escaping RCTPromiseResolveBlock,
                   reject: @escaping RCTPromiseRejectBlock) {
    Task.detached(priority: .userInitiated) {
      do {
        let walletIdentifier = try self.getCurrentWalletIdentifier()
        let messageSigningWorker = MessageSigningWorker(walletWorker: self.walletWorker)
        let signedMessage = try await messageSigningWorker.signMessageWithPrefix(walletIdentifier: walletIdentifier,
                                                                                 message: message)
        resolve(signedMessage)
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
  @objc
  func getSecretPhrase(_ resolve: @escaping RCTPromiseResolveBlock,
                       reject: @escaping RCTPromiseRejectBlock) {
    Task.detached(priority: .userInitiated) {
      do {
        let identifier = try self.getCurrentWalletIdentifier()
        let mnemonic = try await self.walletWorker.exportMnemonic(for: identifier)
        
        resolve(mnemonic)
      } catch {
        reject(nil, nil, error)
      }
    }
  }
  
}

// MARK: - Private helpers

private extension WalletManager {
  
  func importWallet(mnemonic: String,
                    name: String) async throws -> MultiversXWallet {
    try await walletWorker.importWallet(for: mnemonic,
                                        name: name,
                                        and: PasswordGenerator.generate())
  }
  
  func generateNewWallet(for name: WalletName) async throws -> MultiversXWallet {
    let password = PasswordGenerator.generate()
    let wallet = try await walletWorker.createWallet(for: password,
                                                     and: name)
    
    return wallet
  }
  
  func getCurrentWalletIdentifier() throws -> String {
    guard let identifier = CurrentWalletStore.id else {
      throw WalletError.noDefaultWallet
    }
    
    return identifier
  }
  
  func decodeTransactionInputs(transaction: [String: Any]) throws -> TransactionInput {
    let decoder = JSONDecoder()
    
    guard let json = try? JSONSerialization.data(withJSONObject: transaction),
          let inputTx = try? decoder.decode(TransactionInput.self, from: json) else {
      throw WalletError.somethingWentWrong
    }
    
    return inputTx
  }
  
  func signTransaction(_ transactionInput: TransactionInput,
                       for walletIdentifier: WalletIdentifier) async throws -> String {
    let signingWorker = TransactionSigningWorker(walletWorker: walletWorker)
    
    return try await signingWorker.signTransaction(transactionInput,
                                                   walletIdentifier: walletIdentifier)
  }
  
}

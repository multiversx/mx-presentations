//
//  KeychainWorker+WalletStore.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

protocol WalletStore {
  func getPassword(for identifier: WalletIdentifier) -> WalletPassword?
  func setPassword(_ password: WalletPassword, for identifier: WalletIdentifier)
  func deletePassword(for identifier: WalletIdentifier) throws
}

extension KeychainWorker: WalletStore {
  
  func getPassword(for identifier: WalletIdentifier) -> WalletPassword? {
    keychain[identifier]
  }
  
  func setPassword(_ password: WalletPassword, for identifier: WalletIdentifier) {
    keychain[identifier] = password
  }
  
  func deletePassword(for identifier: WalletIdentifier) throws {
    try keychain.remove(identifier)
  }
  
}

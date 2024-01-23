//
//  KeychainWorker.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import KeychainAccess

struct KeychainWorker {
  
  // MARK: - Private vars
  
  private static var serviceName: String {
    Constants.appPrefix
  }
  let keychain: Keychain
  
  // MARK: - Init
  
  init() {
    self.keychain = Keychain(service: Self.serviceName)
  }
  
}

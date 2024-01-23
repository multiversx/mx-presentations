//
//  CurrentWalletStore.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

struct CurrentWalletStore {
  
  @UserDefaultsBacked<String?>(key: "currentWallet")
  static var id
  
  static func clean() {
    CurrentWalletStore.id = nil
  }
  
}

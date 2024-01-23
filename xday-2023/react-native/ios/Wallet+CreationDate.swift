//
//  Wallet+CreationDate.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import WalletCore

extension Wallet {
  
  var creationDate: Date? {
    try? keyURL.resourceValues(forKeys: [.creationDateKey]).creationDate
  }
  
}

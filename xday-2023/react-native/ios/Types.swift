//
//  Types.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

typealias WalletIdentifier = String
typealias WalletPassword = String
typealias WalletName = String
typealias WalletSecretPhrase = String
typealias AccountAddress = String

struct MultiversXWallet: Encodable, Sendable {
  let identifier: WalletIdentifier
  let accounts: [MultiversXAccount]
  let creationDate: Date?
}

struct MultiversXAccount: Encodable, Sendable {
  let address: AccountAddress
  let coin: Int
}

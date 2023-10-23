//
//  TransactionInput.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import BigInt

struct TransactionInput: Codable {
  struct UnspentTransaction: Codable {
    let utxoHash: String
    let utxoIndex: Int
    let utxoAmount: String
  }
  
  let sender: String
  let receiver: String
  let amount: String
  let chainId: String
  let nonce: Int
  let data: String?
  let gasPrice: String?
  let gasLimit: String?
  let feePerDataByte: Int?
  // Binance only
  let accountNumber: Int?
  // BTC only, list of unspent transactions for account
  let unspentTransaction: [UnspentTransaction]?
  // BTC only, flag if the user chosed to send the max amount or not.
  // If true, WallerCore will handle the final amount in order to cover for fees too.
  let useMax: Bool?
  let version: Int?
  let options: Int?
  let guardian: String?
  
  let erc20Contract: String?
  let senderUsername: String?
  let receiverUsername: String?
  
  var bigIntAmount: BigInt? {
    BigInt(amount, radix: 10)
  }
  
  var bigIntGasPrice: BigInt? {
    guard let gasPrice = gasPrice else {
      return nil
    }
    return BigInt(gasPrice, radix: 10)
  }
  
  var intGasLimit: Int {
    guard let gasLimit = gasLimit else {
      return 0
    }
    
    return Int(gasLimit) ?? 0
  }
  
}

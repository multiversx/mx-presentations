//
//  TransactionSigningWorker.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import WalletCore

enum TransactionSigningError: String, Error {
  case badTransactionPrerequisites
  case failedToSignMessage
}

protocol TransactionSigningProtocol {
  func signTransaction(_ inputTx: TransactionInput,
                       walletIdentifier: WalletIdentifier) async throws -> String
}

struct TransactionSigningWorker {
  
  // MARK: - Private helpers
  
  private let walletWorker: WalletProtocol
  
  // MARK: - Init
  
  init(walletWorker: WalletProtocol) {
    self.walletWorker = walletWorker
  }
  
}

// MARK: - Public API

extension TransactionSigningWorker: TransactionSigningProtocol {
  
  func signTransaction(_ inputTx: TransactionInput,
                       walletIdentifier: WalletIdentifier) async throws -> String {
    let privateKey = try await walletWorker.getPrivateKey(for: walletIdentifier)
    let signerInput = try getSignerInput(for: inputTx,
                                         and: privateKey)
    
    let signedTx: MultiversXSigningOutput = AnySigner.sign(input: signerInput,
                                                           coin: .multiversX)
    
    return signedTx.encoded
  }
  
}

// MARK: - Private helpers

private extension TransactionSigningWorker {
  
  func getSignerInput(for inputTx: TransactionInput,
                      and privateKey: PrivateKey) throws -> MultiversXSigningInput {
    guard let inputTxGasPrice = inputTx.gasPrice,
          let inputTxGasLimit = inputTx.gasLimit,
          let gasPrice = UInt64(inputTxGasPrice),
          let gasLimit = UInt64(inputTxGasLimit) else {
      throw TransactionSigningError.badTransactionPrerequisites
    }
    
    let accounts = MultiversXAccounts.with {
      $0.receiver = inputTx.receiver
      $0.sender = inputTx.sender
      $0.senderNonce = UInt64(inputTx.nonce)
      
      if let guardian = inputTx.guardian {
        $0.guardian = guardian
      }
      
      if let encodedSenderUsername = inputTx.senderUsername,
         let decodedUsername = encodedSenderUsername.base64DecodedValue() {
        $0.senderUsername = decodedUsername
      }
      
      if let encodedReceiverUsername = inputTx.receiverUsername,
         let decodedUsername = encodedReceiverUsername.base64DecodedValue() {
        $0.receiverUsername = decodedUsername
      }
    }
    
    let action = MultiversXGenericAction.with {
      $0.accounts = accounts
      $0.value = inputTx.amount
      $0.data = inputTx.data ?? ""
      $0.version = UInt32(inputTx.version ?? 1)
      
      if let options = inputTx.options {
        $0.options = UInt32(options)
      }
    }
    
    let signerInput = MultiversXSigningInput.with {
      $0.privateKey = privateKey.data
      $0.genericAction = action
      $0.chainID = inputTx.chainId
      $0.gasLimit = gasLimit
      $0.gasPrice = gasPrice
    }
    
    return signerInput
  }
  
}

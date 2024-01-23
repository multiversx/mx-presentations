//
//  SigningWorker.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

protocol MessageSigningProtocol {
  func signMessageWithPrefix(walletIdentifier: WalletIdentifier,
                             message: String) async throws -> String
}

struct MessageSigningWorker {
  
  // MARK: - Private vars
  
  private let walletWorker: WalletProtocol
  
  // MARK: - Init
  
  init(walletWorker: WalletProtocol) {
    self.walletWorker = walletWorker
  }
  
}

// MARK: - Public API

extension MessageSigningWorker: MessageSigningProtocol {
  
  func signMessageWithPrefix(walletIdentifier: String, message: String) async throws -> String {
    let messageSize = message.data(using: .utf8)?.count ?? 0
    
    var bytes = [UInt8](Constants.signMessagePrefix.utf8)
    bytes.append(contentsOf: [UInt8]("\(messageSize)".utf8))
    bytes.append(contentsOf: [UInt8](message.utf8))
    
    return try await signMessage(walletIdentifier: walletIdentifier,
                                 message: Data(bytes.sha3(.keccak256))).hex
  }
  
}

// MARK: - Private helpers

private extension MessageSigningWorker {
  
  func signMessage(walletIdentifier: String, message: Data) async throws -> Data {
    let privateKey = try await walletWorker.getPrivateKey(for: walletIdentifier)
    
    guard let signedMessage = privateKey.sign(digest: message, curve: .ed25519) else {
      throw TransactionSigningError.failedToSignMessage
    }
    
    return signedMessage
  }
  
}

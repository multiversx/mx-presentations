//
//  String+Decoding.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

extension String {
  
  func base64DecodedValue() -> String? {
    guard let data = Data(base64Encoded: self) else {
      return nil
    }
    
    return String(data: data, encoding: .utf8)
  }
  
}

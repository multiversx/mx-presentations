//
//  Data+Hex.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

extension Data {
  
  var hex: String {
    map { String(format: "%02hhx", $0) }.joined()
  }
  
  init?(hexString: String) {
    let length = hexString.count / 2
    var data = Data(capacity: length)
    var i = hexString.startIndex
    while i < hexString.endIndex {
      let j = hexString.index(i, offsetBy: 2)
      if let byte = UInt8(hexString[i..<j], radix: 16) {
        data.append(byte)
      } else {
        return nil
      }
      i = j
    }
    
    self = data
  }
  
}

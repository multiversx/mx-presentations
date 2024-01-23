//
//  Encodable+Helpers.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

import Foundation

extension Encodable {
  
  func asDictionary() -> [String: Any] {
    do {
      let data = try JSONEncoder().encode(self)
      guard let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else { return [:] }
      return dictionary
    } catch {
      return [:]
    }
  }
  
}

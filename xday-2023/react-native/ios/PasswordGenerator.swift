//
//  PasswordGenerator.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

import Security

struct PasswordGenerator {
  
  static func generate() -> String {
    // generate some secure password
    randomString(length: 20)
  }
  
  static func randomString(length: Int) -> String {
    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return String((0..<length).map{ _ in letters.randomElement()! })
  }
  
}

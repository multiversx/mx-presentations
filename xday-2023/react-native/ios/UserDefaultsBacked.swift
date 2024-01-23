//
//  UserDefaultsBacked.swift
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

import Foundation

// MARK: - UserDefaultsBacked

@propertyWrapper struct UserDefaultsBacked<T> {
  
  var wrappedValue: T {
    get {
      storage.object(forKey: key) as? T ?? defaultValue
    }
    set {
      if let optional = newValue as? AnyOptional, optional.isNil {
        storage.removeObject(forKey: key)
        
      } else {
        storage.setValue(newValue, forKey: key)
      }
    }
  }
  
  private let key: String
  private let defaultValue: T
  private let storage: UserDefaults
  
  init(key: String,
       defaultValue: T,
       storage: UserDefaults = .standard) {
    self.defaultValue = defaultValue
    self.key = key
    self.storage = storage
  }
  
}

extension UserDefaultsBacked where T: ExpressibleByNilLiteral {
  
  init(key: String) {
    self.init(key: key, defaultValue: nil)
  }
  
}

// MARK: - UserDefaultsBackedCustomObject

@propertyWrapper struct UserDefaultsBackedCustomObject<T: Codable> {
  
  var wrappedValue: T {
    get {
      guard let data = storage.object(forKey: key) as? Data,
            let value = try? JSONDecoder().decode(T.self, from: data) else {
        return defaultValue
      }
      
      return value
    }
    
    set {
      if let optional = newValue as? AnyOptional, optional.isNil {
        storage.removeObject(forKey: key)
        
      } else if let encoded = try? JSONEncoder().encode(newValue) {
        storage.set(encoded, forKey: key)
      }
    }
  }
  
  private let key: String
  private let defaultValue: T
  private let storage: UserDefaults
  
  init(key: String,
       defaultValue: T,
       storage: UserDefaults = .standard) {
    self.defaultValue = defaultValue
    self.key = key
    self.storage = storage
  }
  
}

extension UserDefaultsBackedCustomObject where T: ExpressibleByNilLiteral {
  
  init(key: String) {
    self.init(key: key, defaultValue: nil)
  }
  
}

// MARK: - Helpers

private protocol AnyOptional {
  var isNil: Bool { get }
}

extension Optional: AnyOptional {
  var isNil: Bool { self == nil }
}

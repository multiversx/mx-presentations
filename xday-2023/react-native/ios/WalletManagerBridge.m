//
//  WalletManagerBridge.m
//  WalletApp
//
//  Created by Lucian Savencu on 18.09.2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WalletManager, NSObject)

RCT_EXTERN_METHOD(generateNewWallet:(NSString *)name
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(importWallet:(NSString *)mnemonic
                  name:(NSString *)name
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(signTransaction: (NSDictionary *)transaction
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeWallet:(NSString *)identifier
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeAllWallets: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(signMessage: (NSString *)message
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSecretPhrase: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)

@end

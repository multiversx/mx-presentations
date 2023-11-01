package com.walletapp.module.wallet

import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Arguments
import com.google.gson.Gson
import com.maiar2.data.model.wallet.SignTransactionInput
import com.walletapp.util.toJsonString


class WalletManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = TAG

    private val walletInteractor: WalletInteractor
    private val gson = Gson()

    init {
        val masterKey = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
        val sharedPreferences = EncryptedSharedPreferences.create(
            "wallet_prefs",
            masterKey,
            reactContext.applicationContext,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
        walletInteractor = WalletInteractor(sharedPreferences)
    }

    @ReactMethod
    fun generateNewWallet(name: String, promise: Promise) {
        val wallet = walletInteractor.generateNewWallet(name)
        walletMap.putString("identifier", wallet.identifier)
        walletMap.putString("address", wallet.address)
        promise.resolve(walletMap)
    }

    @ReactMethod
    fun importWallet(mnemonic: String, name: String, promise: Promise) {
        try {
            val wallet = walletInteractor.importWallet(mnemonic, name)
            walletMap.putString("identifier", wallet.identifier)
            walletMap.putString("address", wallet.address)
            promise.resolve(walletMap)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun signTransaction(transactionMap: ReadableMap, promise: Promise) {
        try {
            val transactionJson = transactionMap.toJsonString()
            val signTransactionInput = gson.fromJson(transactionJson, SignTransactionInput::class.java)
            val signedTransaction = walletInteractor.signTransaction(signTransactionInput)
            promise.resolve(signedTransaction)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun removeWallet(identifier: String, promise: Promise) {
        walletInteractor.removeWallet(identifier)
        promise.resolve(null)
    }

    @ReactMethod
    fun removeAllWallets(promise: Promise) {
        walletInteractor.removeAllWallets()
        promise.resolve(null)
    }

    @ReactMethod
    fun signMessage(message: String, promise: Promise) {
        try {
            val signedMessage = walletInteractor.signMessage(message)
            promise.resolve(signedMessage)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun getSecretPhrase(promise: Promise) {
        try {
            val mnemonic = walletInteractor.getSecretPhrase()
            promise.resolve(mnemonic)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    companion object {
        private const val TAG = "WalletManager"
    }
}

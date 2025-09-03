package com.walletapp.module.wallet

import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import com.maiar2.data.model.wallet.SignTransactionInput
import com.walletapp.module.wallet.data.Wallet
import com.walletapp.module.wallet.data.WalletInfo
import com.walletapp.module.wallet.signer.WalletSigner
import wallet.core.jni.CoinType
import wallet.core.jni.HDWallet
import wallet.core.jni.PrivateKey
import wallet.core.jni.StoredKey
import java.nio.charset.StandardCharsets

class WalletInteractor(private val encryptedSharedPreferences: SharedPreferences) {

    private var currentPrivateKey: PrivateKey? = null
    private var currentHdWallet: HDWallet? = null

    init {
        val identifier = getMostRecentWalletIdentifier()
        identifier?.let{
            currentHdWallet = readHdWalletFromStorage(identifier)
            currentPrivateKey = currentHdWallet?.getKeyForCoin(CoinType.MULTIVERSX)
        }
    }

    fun generateNewWallet(name: String): Wallet {
        return createWallet(name)
    }

    fun importWallet(mnemonic: String, name: String): Wallet {
        return createWallet(name,mnemonic)
    }

    fun signTransaction(signTransactionInput:SignTransactionInput): String {
        return currentPrivateKey?.let { WalletSigner.signTransaction(it, signTransactionInput) } ?: "Missing private key!"
    }

    fun signMessage(message: String): String {
        return currentPrivateKey?.let { WalletSigner.signMessage(it, message) } ?: "Missing private key!"
    }

    fun getSecretPhrase(): String {
        return currentHdWallet?.mnemonic() ?: "Error!"
    }

    fun removeWallet(identifier: String) {
        val sharedPrefTransaction = encryptedSharedPreferences.edit()
            .remove(KEY_WALLET_FORMAT.format(identifier))

        if(encryptedSharedPreferences.getString(KEY_MOST_RECENT_WALLET_IDENTIFIER,"") == identifier){
            sharedPrefTransaction.remove(KEY_MOST_RECENT_WALLET_IDENTIFIER)
        }

        sharedPrefTransaction.apply()
    }

    fun removeAllWallets() {
        encryptedSharedPreferences.edit()
            .clear()
            .apply()
    }

    private fun createWallet(name: String, mnemonic: String? = null): Wallet {
        val hdWallet = if (mnemonic == null) {
            HDWallet(WALLET_STRENGTH_FAST, name)
        } else {
            HDWallet(mnemonic, name)
        }

        storeWallet(name, hdWallet)
        return initWallet(hdWallet, name)
    }

    private fun initWallet(
        hdWallet: HDWallet,
        name: String
    ): Wallet {
        val nameByteArray = name.toByteArray(StandardCharsets.UTF_8)
        val storedKey = StoredKey.importHDWallet(hdWallet.mnemonic(), "", nameByteArray, CoinType.MULTIVERSX)
        val storedKeyWallet = storedKey.wallet(nameByteArray)
        val address = storedKeyWallet.getAddressForCoin(CoinType.MULTIVERSX)
        currentHdWallet = storedKeyWallet
        currentPrivateKey = storedKeyWallet.getKeyForCoin(CoinType.MULTIVERSX)
        return Wallet(name, address)
    }

    private fun storeWallet(name: String, hdWallet: HDWallet) {
        val walletStorageKey = KEY_WALLET_FORMAT.format(name)
        encryptedSharedPreferences.edit()
            .putString(walletStorageKey, hdWallet.mnemonic())
            .putString(KEY_MOST_RECENT_WALLET_IDENTIFIER, name)
            .apply()
    }

    private fun readWalletFromStorage(key: String): WalletInfo {
        val identifier = key.substringAfter(KEY_WALLET_PREFIX)
        val mnemonic = encryptedSharedPreferences.getString(key, "") ?: ""
        return WalletInfo(identifier, mnemonic)
    }

    private fun readHdWalletFromStorage(identifier: String): HDWallet {
        val key = KEY_WALLET_FORMAT.format(identifier)
        val mnemonic = encryptedSharedPreferences.getString(key, "") ?: ""
        val nameByteArray = identifier.toByteArray(StandardCharsets.UTF_8)
        val storedKey = StoredKey.importHDWallet(mnemonic, "", nameByteArray, CoinType.MULTIVERSX)
        return storedKey.wallet(nameByteArray)
    }

    private fun getMostRecentWalletIdentifier() = encryptedSharedPreferences.getString(KEY_MOST_RECENT_WALLET_IDENTIFIER, null)

    companion object {
        private const val WALLET_STRENGTH_FAST = 128
        private const val WALLET_STRENGTH_SECURE = 256
        private const val KEY_WALLET_PREFIX = "stored_"
        private const val KEY_WALLET_FORMAT = "${KEY_WALLET_PREFIX}%s"
        private const val KEY_MOST_RECENT_WALLET_IDENTIFIER = "most_recent_identifier"
    }

}

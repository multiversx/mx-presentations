package com.walletapp.module.wallet.signer

import com.google.protobuf.ByteString
import com.maiar2.data.model.wallet.SignTransactionInput
import org.bouncycastle.jcajce.provider.digest.Keccak
import wallet.core.java.AnySigner
import wallet.core.jni.Base64
import wallet.core.jni.CoinType
import wallet.core.jni.Curve
import wallet.core.jni.PrivateKey
import wallet.core.jni.proto.MultiversX

object WalletSigner {
    fun signTransaction(privateKey: PrivateKey, transaction: SignTransactionInput): String {
        val accountsBuilder = MultiversX.Accounts.newBuilder()
            .setSender(transaction.sender)
            .setReceiver(transaction.receiver)
            .setSenderNonce(transaction.nonce.toLong())

        if (transaction.senderUsername != null) {
            accountsBuilder.senderUsername = Base64.decode(transaction.senderUsername).decodeToString()
        }

        if (transaction.receiverUsername != null) {
            accountsBuilder.receiverUsername = Base64.decode(transaction.receiverUsername).decodeToString()
        }

        if (transaction.guardian != null) {
            accountsBuilder.guardian = transaction.guardian
        }

        val accounts = accountsBuilder.build()

        val genericActionBuilder = MultiversX.GenericAction.newBuilder()
            .setAccounts(accounts)
            .setValue(transaction.amount)
            .setVersion(transaction.version ?: 1)

        if (transaction.data?.isNotEmpty() == true) {
            genericActionBuilder.data = transaction.data
        }

        if (transaction.options != null) {
            genericActionBuilder.options = transaction.options
        }

        val signingInput = MultiversX.SigningInput.newBuilder()
        signingInput.privateKey = ByteString.copyFrom(privateKey.data())
        signingInput.gasLimit = transaction.gasLimit.toLong()
        signingInput.gasPrice = transaction.gasPrice.toLong()
        signingInput.chainId = transaction.chainId
        signingInput.genericAction = genericActionBuilder.build()

        val signerOutput = AnySigner.sign(signingInput.build(), CoinType.MULTIVERSX, MultiversX.SigningOutput.parser())
        return signerOutput.encoded
    }

    fun signMessage(privateKey: PrivateKey, message: String): String {
        val messageBytes = message.toByteArray()
        val bytes = MESSAGE_PREFIX.toByteArray()
            .plus(messageBytes.size.toString().toByteArray())
            .plus(messageBytes)

        val hash = keccakRaw(bytes)
        val signedMessageByteArray = privateKey.sign(hash, Curve.ED25519)
        return toHex(signedMessageByteArray)
    }

    private fun toHex(bytes: ByteArray): String {
        val hexChars = CharArray(bytes.size * 2)
        for (i in bytes.indices) {
            val v = bytes[i].toInt() and 0xFF
            hexChars[i * 2] = HEX_ARRAY[v ushr 4]
            hexChars[i * 2 + 1] = HEX_ARRAY[v and 0x0F]
        }
        return String(hexChars)
    }

    private fun keccakRaw(message: ByteArray): ByteArray {
        return Keccak.Digest256().digest(message)
    }

    private const val MESSAGE_PREFIX = "\u0017Elrond Signed Message:\n"
    private val HEX_ARRAY = "0123456789abcdef".toCharArray()

}
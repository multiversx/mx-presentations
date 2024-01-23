package com.maiar2.data.model.wallet

data class SignTransactionInput(
    val sender: String,
    val receiver: String,
    val amount: String,
    val chainId: String,
    val nonce: Int,
    val data: String?,
    val gasPrice: String,
    val gasLimit: String,
    val feePerDataByte: Int,
    val version: Int?,
    val options: Int?,
    val guardian: String?,
    val senderUsername: String?,
    val receiverUsername: String?
)

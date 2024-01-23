package com.walletapp.util

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject


fun ReadableMap.toJsonString():String{
    return toJSONObject(this).toString()
}

@Throws(JSONException::class)
fun toJSONObject(readableMap: ReadableMap): JSONObject {
    val jsonObject = JSONObject()
    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val type = readableMap.getType(key)
        when (type) {
            ReadableType.Null -> jsonObject.put(key, null)
            ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
            ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
            ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
            ReadableType.Map -> jsonObject.put(key, readableMap.getMap(key)?.let { toJSONObject(it) })
            ReadableType.Array -> jsonObject.put(key, readableMap.getArray(key)?.let { toJSONArray(it) })
        }
    }
    return jsonObject
}

@Throws(JSONException::class)
fun toJSONArray(readableArray: ReadableArray): JSONArray {
    val jsonArray = JSONArray()
    for (i in 0 until readableArray.size()) {
        val type = readableArray.getType(i)
        when (type) {
            ReadableType.Null -> jsonArray.put(i, null)
            ReadableType.Boolean -> jsonArray.put(i, readableArray.getBoolean(i))
            ReadableType.Number -> jsonArray.put(i, readableArray.getDouble(i))
            ReadableType.String -> jsonArray.put(i, readableArray.getString(i))
            ReadableType.Map -> jsonArray.put(i, toJSONObject(readableArray.getMap(i)))
            ReadableType.Array -> jsonArray.put(i,toJSONArray(readableArray.getArray(i)))
        }
    }
    return jsonArray
}

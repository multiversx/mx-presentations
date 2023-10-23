package com.walletapp

import MainPackage
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    init {
        System.loadLibrary("TrustWalletCore")
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this,  /* native exopackage */false)
        ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return reactNativeHost
    }

    private val reactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {

        override fun getPackages(): MutableList<ReactPackage> {
            return  PackageList(this@MainApplication).packages.apply {
                add(MainPackage())
            }
        }

        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }
}
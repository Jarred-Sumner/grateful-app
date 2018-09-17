package com.grateful;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import io.sentry.RNSentryPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.oblador.keychain.KeychainPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeOneSignalPackage(),
            new RNSentryPackage(),
            new PickerPackage(),
            new RNAccountKitPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNPromptPackage(),
            new KeychainPackage(),
            new RNDeviceInfo(),
            new ReactNativeContacts()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

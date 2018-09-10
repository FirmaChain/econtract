package org.firmachain.poc;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.reactlibrary.RNSketchViewPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.beefe.picker.PickerViewPackage;
import org.wonday.pdf.RCTPdfView;
import com.peel.react.rnos.RNOSModule;
import com.github.yamill.orientation.OrientationPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.microsoft.codepush.react.CodePush;

import com.bitgo.randombytes.RandomBytesPackage;
import com.reactlibrary.RNSketchViewPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.beefe.picker.PickerViewPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
    return CodePush.getJSBundleFile();
    }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNSketchViewPackage(),
            new RandomBytesPackage(),
            new PickerViewPackage(),
            new RCTPdfView(),
            new RNOSModule(),
            new OrientationPackage(),
            new RNGoogleSigninPackage(),
            new RNFSPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeDocumentPicker(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this)
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

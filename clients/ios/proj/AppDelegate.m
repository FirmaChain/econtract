/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>
#import <AppCenterReactNativeAnalytics/AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNative/AppCenterReactNative.h>
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FirebaseCore/FirebaseCore.h>
#import <RNGoogleSignin.h>
#import <Orientation.h>
#import <React/RCTLinkingManager.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  [AppCenterReactNative register];  // Initialize AppCenter 

  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];  // Initialize AppCenter analytics
  [AppCenterReactNative register];  // Initialize AppCenter
  
    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"proj"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  [FIRApp configure];
  
  NSArray *fontFamilies = [UIFont familyNames];
  
  for (int i = 0; i < [fontFamilies count]; i++)
  {
    NSString *fontFamily = [fontFamilies objectAtIndex:i];
    NSArray *fontNames = [UIFont fontNamesForFamilyName:[fontFamilies objectAtIndex:i]];
    NSLog (@"%@: %@", fontFamily, fontNames);
  }

  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  
  BOOL handled2 = [RNGoogleSignin
    application:application
    openURL:url
    sourceApplication:sourceApplication
    annotation:annotation
  ];
  BOOL handled3 = [RCTLinkingManager
    application:application
    openURL:url
    sourceApplication:sourceApplication
    annotation:annotation
  ];

  return handled2 || handled3;
} 

@end

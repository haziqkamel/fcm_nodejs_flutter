import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';

import 'my_home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging fcm = FirebaseMessaging.instance;

  // Get Firebase Token
  fcm.getToken().then(
        (fcmToken) => print(
          'getToken : $fcmToken',
        ),
      );

  if (Platform.isIOS) {
    requestPermissionForIos(fcm);
  }

  // Foreground
  /**
   * When the application is open, in view & in use.
   */
  FirebaseMessaging.onMessage.listen((RemoteMessage remoteMessage) {
    print('Got a message whilst in the foreground!');
    print('Message data: ${remoteMessage.data}');

    if (remoteMessage.notification != null) {
      print(
          'Message also contained a notification: ${remoteMessage.notification}');
    }
  });

  // Background
  /**
   * When the application is open, however in the background (minimised). 
   * This typically occurs when the user has pressed the "home" button on the device, 
   * has switched to another app via the app switcher or has the application open on a different tab (web).
   */
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Terminated:
  /**
   * When the device is locked or the application is not running. 
   * The user can terminate an app by "swiping it away" 
   * via the app switcher UI on the device or closing a tab (web).
   */

  runApp(const MyApp());
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  print("Handling a background message: ${message.messageId}");
}

void requestPermissionForIos(FirebaseMessaging fcm) async {
  NotificationSettings settings = await fcm.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  print('User granter permission ${settings.authorizationStatus}');
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
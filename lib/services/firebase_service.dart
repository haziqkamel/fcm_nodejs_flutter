import 'dart:convert';
import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class FirebaseService {
  static FirebaseMessaging? _firebaseMessaging;
  static FirebaseMessaging get firebaseMessaging =>
      FirebaseService._firebaseMessaging ?? FirebaseMessaging.instance;

  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static Future<void> initializeFirebase() async {
    Firebase.initializeApp();
    FirebaseService._firebaseMessaging = FirebaseMessaging.instance;
    _firebaseMessaging!
        .subscribeToTopic('recentNews')
        .then((_) => print('Subscribed to recentNews topic'));

    await FirebaseService.initializeLocalNotifications();
    await onMessage();
    await onBackgroundMsg();
    await onMessageOpenedApp();
    await onAppTerminated();
  }

  Future<String?> getDeviceToken() async => await firebaseMessaging.getToken();

  static final FlutterLocalNotificationsPlugin
      _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  /// LocalNotifications Initialization Settings
  static Future<void> initializeLocalNotifications() async {
    final InitializationSettings initSettings = InitializationSettings(
      android: const AndroidInitializationSettings('@mipmap/ic_launcher'),
      iOS: DarwinInitializationSettings(
        requestAlertPermission: true,
        requestSoundPermission: true,
        requestBadgePermission: true,
        requestCriticalPermission: false,
        defaultPresentAlert: true,
        defaultPresentSound: true,
        defaultPresentBadge: true,
        onDidReceiveLocalNotification: (id, title, body, payload) {},
        notificationCategories: [],
      ),
    );

    // Android receive notifications OnForeground
    await FirebaseService._flutterLocalNotificationsPlugin.initialize(
        initSettings,
        onDidReceiveNotificationResponse: _onReceiveNotification);

    // iOS receive notifications OnForeground
    await FirebaseService.firebaseMessaging
        .setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  static String channelId = 'high_importance_channel';
  static String channelName = 'High Importance Notifications';
  static final NotificationDetails _notificationDetails = NotificationDetails(
    android: AndroidNotificationDetails(
      channelId,
      channelName,
      priority: Priority.max,
      importance: Importance.max,
    ),
    iOS: const DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    ),
  );

  // Foreground
  /// When the application is open, in view & in use.
  static Future<void> onMessage() async {
    FirebaseMessaging.onMessage.listen((remoteMessage) async {
      if (Platform.isAndroid) {
        await FirebaseService._flutterLocalNotificationsPlugin.show(
          0,
          remoteMessage.notification!.title,
          remoteMessage.notification!.body,
          _notificationDetails,
          payload: remoteMessage.data.toString(),
        );
        Navigator.pushNamed(
          navigatorKey.currentState!.context,
          '/home-page',
          arguments: {
            'message': jsonEncode(remoteMessage.data),
          },
        );
      }
    });
  }

  // Background
  ///  When the application is open, however in the background (minimised).
  /// This typically occurs when the user has pressed the "home" button on the device,
  /// has switched to another app via the app switcher or has the application open on a different tab (web).
  static Future<void> onBackgroundMsg() async {
    FirebaseMessaging.onBackgroundMessage(_onBackgroundMessageHandler);
  }

  // Terminated:
  /// When the device is locked or the application is not running.
  /// The user can terminate an app by "swiping it away"
  /// via the app switcher UI on the device or closing a tab (web).
  static Future<void> onAppTerminated() async {
    await FirebaseService._firebaseMessaging!
        .getInitialMessage()
        .then((remoteMessage) {
      if (remoteMessage != null) {
        Navigator.pushNamed(
          navigatorKey.currentState!.context,
          '/home-page',
          arguments: {
            'message': jsonEncode(remoteMessage.data),
          },
        );
      }
    });
  }

  // OnMessageOpenedApp
  /// If your app is opened via a notification whilst the app is terminated
  static Future<void> onMessageOpenedApp() async {
    FirebaseMessaging.onMessageOpenedApp.listen((remoteMessage) {
      print('onMessageOpenedApp: $remoteMessage');
      Navigator.pushNamed(
        navigatorKey.currentState!.context,
        '/home-page',
        arguments: {
          'message': jsonEncode(remoteMessage.data),
        },
      );
    });
  }

  static void _onReceiveNotification(NotificationResponse details) {
    // TODO: Write onReceiveNotification
  }

  static Future<void> _onBackgroundMessageHandler(RemoteMessage message) async {
    // If you're going to use other Firebase services in the background, such as Firestore,
    // make sure you call `initializeApp` before using other Firebase services.
    await Firebase.initializeApp();
    print("Handling a background message: ${message.messageId}");
    return;
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
}

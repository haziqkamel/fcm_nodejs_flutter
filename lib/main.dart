import 'package:fcm_nodejs_demo/empty_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'my_home_page.dart';
import 'services/firebase_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp().then(
    (_) async => await FirebaseService.initializeFirebase(),
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    String title = 'Flutter Demo Home Page';
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      navigatorKey: FirebaseService.navigatorKey,
      routes: {
        '/': (context) => const EmptyPage(),
        '/home-page': (context) => MyHomePage(title: title),
      },
    );
  }
}

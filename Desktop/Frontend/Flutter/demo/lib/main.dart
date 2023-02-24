import 'dart:math';

import 'package:flutter/material.dart';

import 'first_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String buttonName = "Clik";
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Extension(),
    );
  }
}

class Extension extends StatefulWidget {
  const Extension({super.key});

  @override
  State<Extension> createState() => _ExtensionState();
}

class _ExtensionState extends State<Extension> {
  String buttonName = 'Click';
  int currentIndex = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('App title'),
      ),
      body: Center(
        child: currentIndex == 0
            ? Container(
                // decoration: BoxDecoration(
                //     image: DecorationImage(
                //   image: AssetImage("/Users/dharsinikr/Downloads/Bus_ticket.jpeg"),
                // )),
                color: Colors.red,
                width: double.infinity,
                height: double.infinity,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            onPrimary: Colors.white, primary: Colors.red),
                        onPressed: () {
                          setState(() {
                            buttonName = "hi";
                          });
                        },
                        child: Text(buttonName)),
                    ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (BuildContext context) {
                                return const Nextpage();
                              },
                            ),
                          );
                        },
                        child: Text('Click Me!'))
                  ],
                ),
              )
            : GestureDetector(
                onTap: () {
                  Icon(Icons.favorite, color: Colors.pink);
                },
                child: Image.asset('images/demo.jpeg'),
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(label: 'Home', icon: Icon(Icons.home)),
          BottomNavigationBarItem(
              label: 'Settings', icon: Icon(Icons.settings)),
          // BottomNavigationBarItem(
          //     label: 'Like',
          //     icon: Icon(
          //       Icons.favorite,
          //       color: Colors.pink,
          //     ))
        ],
        currentIndex: currentIndex,
        onTap: (int index) {
          setState(() {
            currentIndex = index;
          });
        },
      ),
    );
  }
}

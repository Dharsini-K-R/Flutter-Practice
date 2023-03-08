// ignore_for_file: prefer_const_constructors, camel_case_types, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';

class mycard extends StatefulWidget {
  const mycard({super.key});

  @override
  State<mycard> createState() => _mycardState();
}

class _mycardState extends State<mycard> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Container(
        width: 300,
        padding: EdgeInsets.all(20.0),
        decoration: BoxDecoration(
            color: Colors.deepPurple[300],
            borderRadius: BorderRadius.all(Radius.circular(16))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Balance', style: TextStyle(color: Colors.white)),
            SizedBox(
              height: 10,
            ),
            Text("70,000", style: TextStyle(color: Colors.white, fontSize: 28)),
            SizedBox(
              height: 30,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('**** **** **64 8689',
                    style: TextStyle(color: Colors.white)),
                Text('03/27', style: TextStyle(color: Colors.white))
              ],
            )
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class IconsPage extends StatefulWidget {
  final iconImagePath;
  final String buttonText;
  const IconsPage({super.key, this.iconImagePath, required this.buttonText});

  @override
  State<IconsPage> createState() => _IconsPageState();
}

class _IconsPageState extends State<IconsPage> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          height: 100,
          width: 100,
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.all(Radius.circular(20)),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.shade400,
                  blurRadius: 40,
                  spreadRadius: 10,
                )
              ]),
          padding: EdgeInsets.all(10),
          child: Center(child: Image.asset('images/sendMoney.png')),
        ),
        SizedBox(height: 10),
        Text(
          'Send',
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey[700]),
        )
      ],
    );
  }
}

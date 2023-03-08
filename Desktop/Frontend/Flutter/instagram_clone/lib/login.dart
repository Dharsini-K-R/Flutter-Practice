import 'package:flutter/material.dart';
import 'package:instagram_clone/home.dart';

class login extends StatefulWidget {
  const login({super.key});

  @override
  State<login> createState() => _loginState();
}

class _loginState extends State<login> {
  String email = '';
  String password = '';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(),
      body: Container(
        padding: const EdgeInsets.fromLTRB(90, 260, 80, 0),
        height: 500,
        decoration: const BoxDecoration(
          image: DecorationImage(
              image: AssetImage('images/instagramLogo.png'), scale: 4),
        ),
        child: Form(
          child: Column(
            children: <Widget>[
              const SizedBox(height: 20),
              TextFormField(
                onChanged: (value) {
                  setState(() {
                    email = value;
                  });
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                obscureText: true,
                onChanged: (value) {
                  setState(() {
                    password = value;
                  });
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                  onPressed: () async {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (BuildContext context) {
                          return const home();
                        },
                      ),
                    );
                    print(email);
                    print(password);
                  },
                  child: const Text(
                    'Login',
                    style: TextStyle(color: Colors.white),
                  )),
              const SizedBox(height: 18),
              const Text(
                'Forgot password?',
                style: TextStyle(color: Colors.blue),
              )
            ],
          ),
        ),
      ),
    );
  }
}

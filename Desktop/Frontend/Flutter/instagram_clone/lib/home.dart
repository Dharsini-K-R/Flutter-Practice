// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:instagram_clone/cameraPage.dart';
import 'package:instagram_clone/cards.dart';
import 'package:instagram_clone/utilities/icons.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class home extends StatefulWidget {
  const home({super.key});

  @override
  State<home> createState() => _homeState();
}

class _homeState extends State<home> {
  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Colors.blue,
        child: Icon(
          Icons.camera_alt,
          size: 32,
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: Colors.grey[200],
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
                onPressed: () {},
                icon: Icon(
                  Icons.home,
                  size: 32,
                )),
            IconButton(
                onPressed: () {},
                icon: Icon(
                  Icons.settings,
                  size: 32,
                ))
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Container(
            //   child: _image == null ? Text("No image ") : Image.file(_image),
            // ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: const [
                      Text("My ",
                          style: TextStyle(
                              fontSize: 28, fontWeight: FontWeight.bold)),
                      Text("Cards", style: TextStyle(fontSize: 28)),
                    ],
                  ),
                  Container(
                      padding: EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: Colors.grey[400],
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.add))
                ],
              ),
            ),
            SizedBox(
              height: 25,
            ),
            Container(
                height: 200,
                child: PageView(
                  scrollDirection: Axis.horizontal,
                  controller: _controller,
                  children: [mycard(), mycard(), mycard()],
                )),
            SizedBox(
              height: 25,
            ),
            SmoothPageIndicator(
              controller: _controller,
              count: 3,
              effect: ExpandingDotsEffect(activeDotColor: Colors.grey.shade800),
            ),
            SizedBox(
              height: 25,
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconsPage(
                    buttonText: "Send",
                  ),
                  IconsPage(buttonText: "Send"),
                  IconsPage(buttonText: "Send")
                ],
              ),
            ),
            SizedBox(
              height: 25,
            ),
            Padding(
              padding: const EdgeInsets.all(25),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            height: 80,
                            decoration: BoxDecoration(
                                borderRadius:
                                    BorderRadius.all(Radius.circular(15)),
                                color: Colors.white),
                            child: Image(
                                image: AssetImage('images/transaction.png')),
                          ),
                          SizedBox(
                            width: 20,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Transactions',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(
                                height: 12,
                              ),
                              Text(
                                'Transaction History',
                                style: TextStyle(color: Colors.grey[700]),
                              )
                            ],
                          ),
                        ],
                      ),
                      Icon(Icons.arrow_forward_ios)
                    ],
                  ),
                  SizedBox(
                    height: 25,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            height: 80,
                            decoration: BoxDecoration(
                                borderRadius:
                                    BorderRadius.all(Radius.circular(15)),
                                color: Colors.white),
                            child: Image(
                                image: AssetImage('images/statistics.png')),
                          ),
                          SizedBox(
                            width: 20,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Statistics',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  )),
                              SizedBox(
                                height: 12,
                              ),
                              Text(
                                'Payments and Income',
                                style: TextStyle(color: Colors.grey[700]),
                              )
                            ],
                          ),
                        ],
                      ),
                      Icon(Icons.arrow_forward_ios)
                    ],
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

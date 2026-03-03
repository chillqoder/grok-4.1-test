import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Premium App')),
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          ColoredBox(
            color: Colors.red,
            child: Center(child: Text('Home')),
          ),
          ColoredBox(
            color: Colors.green,
            child: Center(child: Text('Explore')),
          ),
          ColoredBox(
            color: Colors.blue,
            child: Center(child: Text('Activity')),
          ),
          ColoredBox(
            color: Colors.orange,
            child: Center(child: Text('Messages')),
          ),
          ColoredBox(
            color: Colors.purple,
            child: Center(child: Text('Profile')),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: 'Explore'),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Activity',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.message), label: 'Messages'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

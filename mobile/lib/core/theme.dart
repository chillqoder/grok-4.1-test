import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get theme => ThemeData(
    useMaterial3: true,
    colorScheme:
        ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1), // Indigo for premium modern feel
          brightness: Brightness.dark,
        ).copyWith(
          surface: const Color(0xFF0F0F23),
          surfaceVariant: const Color(0xFF1E1B38),
          onSurfaceVariant: const Color(0xFFCAC4DD),
          primaryContainer: const Color(0xFF4F4683),
          secondaryContainer: const Color(0xFF5B576D),
        ),
    scaffoldBackgroundColor: const Color(0xFF0A0A14),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: Color(0xFF0F0F23),
    ),
  );
}

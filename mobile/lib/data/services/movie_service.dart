import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../models/movie.dart';

class MovieService {
  static Future<List<Movie>> loadMovies() async {
    try {
      final String jsonString = await rootBundle.loadString(
        'assets/data/movies.json',
      );
      final List<dynamic> jsonList = json.decode(jsonString) as List<dynamic>;
      return jsonList
          .map((dynamic json) => Movie.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      if (kDebugMode) print('Error loading movies: $e');
      return [];
    }
  }
}

import 'package:flutter/foundation.dart';

class Movie {
  final String id;
  final String title;
  final String originalTitle;
  final int year;
  final String description;
  final List<String> genres;
  final List<String> moods;
  final double rating;
  final int duration;
  final String director;
  final List<String> cast;
  final String poster;
  final String backdrop;
  final String language;
  final List<String> tags;
  final String watchStatus;
  final bool isFavorite;
  final int tmdbId;
  final DateTime createdAt;

  const Movie({
    required this.id,
    required this.title,
    required this.originalTitle,
    required this.year,
    required this.description,
    required this.genres,
    required this.moods,
    required this.rating,
    required this.duration,
    required this.director,
    required this.cast,
    required this.poster,
    required this.backdrop,
    required this.language,
    required this.tags,
    required this.watchStatus,
    required this.isFavorite,
    required this.tmdbId,
    required this.createdAt,
  });

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
    id: json['id'] as String,
    title: json['title'] as String,
    originalTitle: json['original_title'] as String,
    year: json['year'] as int,
    description: json['description'] as String,
    genres: (json['genres'] as List).map((e) => e as String).toList(),
    moods: (json['moods'] as List).map((e) => e as String).toList(),
    rating: (json['rating'] as num).toDouble(),
    duration: json['duration'] as int,
    director: json['director'] as String,
    cast: (json['cast'] as List).map((e) => e as String).toList(),
    poster: json['poster'] as String,
    backdrop: json['backdrop'] as String,
    language: json['language'] as String,
    tags: (json['tags'] as List).map((e) => e as String).toList(),
    watchStatus: json['watch_status'] as String,
    isFavorite: json['is_favorite'] as bool,
    tmdbId: json['tmdb_id'] as int,
    createdAt: DateTime.parse(json['created_at'] as String),
  );
}

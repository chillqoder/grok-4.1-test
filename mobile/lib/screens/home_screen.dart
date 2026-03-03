import 'package:flutter/material.dart';
import '../../data/models/movie.dart';
import '../../data/services/movie_service.dart';
import '../../widgets/common/movie_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Movie>> _moviesFuture;

  @override
  void initState() {
    super.initState();
    _moviesFuture = MovieService.loadMovies();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Movie>>(
      future: _moviesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        final movies = snapshot.data ?? [];
        return CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 200.0,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: const Text('Discover'),
                background: movies.isNotEmpty
                    ? Image.network(
                        movies[0].backdrop,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            Container(color: Colors.grey),
                      )
                    : Container(color: Colors.grey),
              ),
            ),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 240,
                child: PageView.builder(
                  itemCount: (movies.length / 5).ceil(),
                  itemBuilder: (context, pageIndex) {
                    final start = pageIndex * 5;
                    final end = (start + 5).clamp(0, movies.length);
                    final pageMovies = movies.sublist(start, end);
                    return ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: pageMovies.length,
                      itemBuilder: (context, index) =>
                          MovieCard(movie: pageMovies[index]),
                    );
                  },
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 2 / 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  childCount: movies.length,
                  (context, index) => MovieCard(movie: movies[index]),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

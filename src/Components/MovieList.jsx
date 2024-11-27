import Movie from "./Movie"

function MovieList({ movies, onHandle }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie SelectedMovie={onHandle} movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    )
}

export default MovieList
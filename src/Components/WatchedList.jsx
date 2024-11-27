import WatchedMovie from './WatchedMovie'

function WatchedList({ watched, handleDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie onDeleteWatched={handleDeleteWatched} movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    )
}
export default WatchedList
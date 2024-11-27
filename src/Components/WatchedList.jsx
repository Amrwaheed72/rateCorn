import WatchedMovie from './WatchedMovie'

const key=crypto.randomUUID()
function WatchedList({ watched, handleDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie onDeleteWatched={handleDeleteWatched} movie={movie} key={key} />
            ))}
        </ul>
    )
}
export default WatchedList
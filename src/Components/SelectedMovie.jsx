import { useEffect,useState,useRef } from "react"
import StarRating from "../StarRating"
function SelectedMovie({ selectedId, handleClose, handleAddWatched, watched }) {

    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [userRating, setUserRating] = useState("")
    const countRef = useRef(0)


    useEffect(function () {
        if (userRating)
            countRef.current = countRef.current + 1
    }, [userRating])

    const isWatched = watched.map(movie => movie.imdbId).includes(selectedId)
    const WatchedUserRating = watched.find(movie => movie.imdbId === selectedId)?.userRating

    const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie;

    function AddWathced() {
        const newWatchedMovie = {
            imdbId: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
            countRatingDecisions: countRef.current
        }
        handleAddWatched(newWatchedMovie)
        handleClose()
    }

    useEffect(function () {
        setIsLoading(true)
        async function detailsFetch() {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
            const data = await res.json()
            setMovie(data)
            setIsLoading(false)
        }
        detailsFetch();
    }, [selectedId])

    useEffect(function () {
        if (!title) return;
        document.title = `Movie | ${title}`
    }, [title])

    useEffect(() => {
        function callBack(e) {
            if (e.key === 'Escape') {
                handleClose();
            }
        }

        document.addEventListener("keydown", callBack);

        return () => {
            document.removeEventListener("keydown", callBack);
        };
    }, [handleClose]);


    return (
        <div className="details">
            {isLoading ? <Loader /> :
                <>
                    <header>
                        <button className="btn-back" onClick={handleClose}>&larr;</button>
                        <img src={poster} alt={`poster of ${movie} movie `} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>{released} &bull; {runtime}</p>
                            <p>{genre}</p>
                            <p>{year}</p>
                            <p><span>⭐ {imdbRating} IMDB Rating</span></p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!isWatched ?
                                <>
                                    <StarRating maxRating={10} size="28" handleRating={setUserRating} onSetRating={setUserRating} />
                                    {userRating > 0 && <button className="btn-add" onClick={AddWathced}>Add to Watched List</button>}{" "}
                                </>
                                : <p>Movie Is Already Rated With <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{WatchedUserRating}</span> ⭐</p>
                            }
                        </div>
                        <p><em>{plot}</em></p>
                        <p>Starring {actors}</p>
                        <p>Directed By {director}</p>
                    </section>
                </>
            }
        </div>
    )
}

export default SelectedMovie
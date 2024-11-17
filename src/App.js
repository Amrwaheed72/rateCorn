import { useEffect, useState } from "react";
import StarRating from './StarRating'


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);



const KEY = '6a6db6da'

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("")
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }


  function handleClose() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id){
    setWatched(watched=>watched.filter(movie=>movie.imdbId!==id))
  }
  useEffect(() => {
    if (!query) return;
    const controller= new AbortController();
    async function fetchingMovies() {
      try {
        setIsLoading(true)
        setError("")

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal});

        if (!res.ok)
          throw new Error('Falied to fetch movies')

        const data = await res.json();
        if (data.Response === 'False') throw new Error('Movie not found ')
        setMovies(data.Search)
      setError("")
      }
      catch (err) {
        console.error(err.message)
        if (err.name!=="AbortError"){
          setError(err.message)
        }
      }
      finally {
        setIsLoading(false)
      }
    }
    if (query.length < 3) {
      setMovies([])
      setError("")
      return
    }
    fetchingMovies();

    return function (){
      controller.abort();
    }
  }, [query])

  return (
    <div>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {!isLoading && !error && <MovieList onHandle={handleSelectMovie} movies={movies} />}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? <SelectedMovie  watched={watched} handleClose={handleClose} handleAddWatched={handleAddWatched} selectedId={selectedId} />
            : <>
              <Summery watched={watched} />
              <WatchedList handleDeleteWatched={handleDeleteWatched} watched={watched} />
            </>}
        </Box>
      </Main>

    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}


function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}
function Search({ query, setQuery }) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
function Loader() {
  return (
    <p className="loader"></p>
  )
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )
}


function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, onHandle }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie SelectedMovie={onHandle} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function Movie({ movie, SelectedMovie }) {
  return (
    <li onClick={() => SelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function SelectedMovie({ selectedId, handleClose, handleAddWatched, watched }) {

  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState("")

  const isWatched = watched.map(movie => movie.imdbId).includes(selectedId)
  const WatchedUserRating=watched.find(movie=>movie.imdbId===selectedId)?.userRating

  const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie;


  function AddWathced() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating
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

  useEffect(function(){
    if(!title) return;
    document.title=`Movie | ${title}`
  },[title])

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
                : <p>Movie Is Already Rated With <span style={{fontWeight:'bold',fontSize:'20px'}}>{WatchedUserRating}</span> ⭐</p>
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

function Warning() {
  return (
    <p>Movie Already exist</p>
  )
}

function Summery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedList({ watched,handleDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie onDeleteWatched={handleDeleteWatched} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function WatchedMovie({ movie,onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>

        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbId)}></button>
      </div>
    </li>
  )
}

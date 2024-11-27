import { useEffect, useRef, useState } from "react";
import StarRating from './StarRating'
import WatchedList from "./Components/WatchedList";
import Summery from "./Components/Summery";


const KEY = '6a6db6da'

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("")
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedMovies = localStorage.getItem('watched')
    return JSON.parse(storedMovies)
  });

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }


  function handleClose() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbId !== id))
  }

  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    async function fetchingMovies() {
      try {
        setIsLoading(true)
        setError("")

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

        if (!res.ok)
          throw new Error('Falied to fetch movies')

        const data = await res.json();
        if (data.Response === 'False') throw new Error('Movie not found ')
        setMovies(data.Search)
        setError("")
      }
      catch (err) {
        console.error(err.message)
        if (err.name !== "AbortError") {
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

    return function () {
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
          {selectedId ? <SelectedMovie watched={watched} handleClose={handleClose} handleAddWatched={handleAddWatched} selectedId={selectedId} />
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
  const inputEl = useRef(null)

  useEffect(function () {

    function callback(e) {
      if(document.activeElement===inputEl.current) return ;
      if(e.code==='Enter'){
        inputEl.current.focus()
        setQuery('')
      }
    }
    document.addEventListener('keydown', callback)
    return () => document.addEventListener('keydown', callback)
  }, [setQuery])
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}
function Loader() {
  return (
    <p className="loader"></p>
  )
}






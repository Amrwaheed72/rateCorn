import { useEffect, useState } from "react";
import WatchedList from "./Components/WatchedList";
import Summery from "./Components/Summery";
import NavBar from './Components/NavBar'
import Logo from './Components/Logo'
import Search from './Components/Search'
import Results from "./Components/Results";
import Main from './Components/Main'
import Box from "./Components/Box";
import MovieList from "./Components/MovieList";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";
import SelectedMovie from "./Components/SelectedMovie";

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

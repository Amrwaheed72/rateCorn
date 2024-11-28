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
import { useMovies } from "./Components/useMovies";
import { useLocalStorageState } from "./Components/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)

  const {movies,isLoading,error} = useMovies(query,handleClose)

  const [watched, setWatched] = useLocalStorageState([],'watched')

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

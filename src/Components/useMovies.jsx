import { useEffect, useState } from "react";
const KEY = '6a6db6da'
export function useMovies(query,callBack) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    useEffect(() => {
        callBack?.()
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

    return {movies,isLoading,error}
}
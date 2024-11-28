import { useState,useEffect } from "react";

export function useLocalStorageState(initialState,key) {
    const [value, setValue] = useState(() => {
        const storedMovies = localStorage.getItem(key)
        return JSON.parse(storedMovies)
    });
    useEffect(function () {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value,key])
    return [value, setValue]
}
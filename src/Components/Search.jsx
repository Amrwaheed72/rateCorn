import { useEffect, useRef } from "react";
import { useKey } from "./useKey";

function Search({ query, setQuery }) {
    const inputEl = useRef(null)
    useKey(function () {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus()
        setQuery('')
    }, 'Enter')
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

export default Search
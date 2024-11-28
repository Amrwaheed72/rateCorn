import { useEffect } from "react";


export function useKey(action,userKey) {
    useEffect(() => {
        function callback(e) {
            if (e.key.toLowerCase() === userKey.toLowerCase()) {
                action()
            }
        }

        document.addEventListener("keydown", callback);

        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, [action,userKey]);

}
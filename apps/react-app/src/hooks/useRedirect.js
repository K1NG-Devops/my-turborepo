// src/hooks/useRedirect.js
import { useCallback } from "react";

function useRedirect() {
  const redirect = useCallback((url, delay) => {
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  }, []);

  return redirect;
}

export default useRedirect;


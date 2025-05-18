import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

function useRedirect() {
  const navigate = useNavigate();

  const redirect = useCallback((url, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        navigate(url);
      }, delay);
    } else {
      navigate(url);
    }
  }, [navigate]);

  return redirect;
}

export default useRedirect;



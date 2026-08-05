import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';

interface UseFetchOptions {
  dependencies?: any[];
  showErrorToast?: boolean;
  errorMessage?: string;
}

export function useFetch<T>(url: string, options: UseFetchOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const dependencies = options.dependencies || [];
  const showErrorToast = options.showErrorToast ?? true;
  const errorMessage = options.errorMessage || 'Failed to fetch data. Please try again.';

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    api.get<T>(url)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(`Fetch error for ${url}:`, err);
          setError(err);
          setIsLoading(false);
          if (showErrorToast) {
            toast.error(errorMessage);
          }
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]);

  return { data, isLoading, error, setData };
}

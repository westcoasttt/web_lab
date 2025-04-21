import { useState } from 'react';

type ApiError = {
  code: number;
  message: string;
};

export const useFetch = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || 'Unknown error',
        }));

        throw {
          code: response.status,
          message: errorData.message || 'Request failed',
        };
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError({
        code: (err as ApiError).code || 0,
        message: (err as ApiError).message || 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
};

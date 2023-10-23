import { useCallback, useState } from 'react';

export function useAsyncAction<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [data, setData] = useState<T | null>(null);

  const onTriggerAction = useCallback(
    async (action: any, onError?: (err: any) => void) => {
      try {
        setError(null);
        setIsLoading(true);

        const res = await action();
        setData(res);
        return res;
      } catch (err: unknown) {
        setError(err);
        onError?.(err);
        console.error(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function onClearError() {
    if (error) {
      setError(null);
    }
  }

  return {
    data,
    isLoading,
    error,
    onClearError,
    onTriggerAction,
    onSetIsLoading: setIsLoading
  };
}

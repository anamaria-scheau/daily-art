import { useCallback, useEffect, useState } from 'react';
import { ArticError, fetchRandomArtwork } from '../api/articClient';
import { RemoteArtwork } from '../logic/artic';

export type RandomArtworkState =
  | { status: 'loading' }
  | { status: 'success'; artwork: RemoteArtwork }
  | { status: 'error'; message: string };

export function useRandomArtwork() {
  const [state, setState] = useState<RandomArtworkState>({ status: 'loading' });
  const [round, setRound] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetchRandomArtwork({ signal: controller.signal })
      .then((artwork) => setState({ status: 'success', artwork }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          message:
            error instanceof ArticError
              ? error.message
              : 'Something went wrong. Please try again.',
        });
      });

    // If the screen closes (or we reload), the old request is cancelled.
    return () => controller.abort();
  }, [round]);

  const reload = useCallback(() => setRound((value) => value + 1), []);

  return { state, reload };
}
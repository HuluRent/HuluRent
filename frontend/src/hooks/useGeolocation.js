import { useState, useEffect, useCallback } from 'react';

// status: 'idle' | 'loading' | 'success' | 'denied' | 'unsupported' | 'error'
export function useGeolocation({ auto = true } = {}) {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setStatus('success');
        setError(null);
      },
      (err) => {
        // err.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        setStatus(err.code === 1 ? 'denied' : 'error');
        setError(err.message);
        setPosition(null);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  useEffect(() => {
    if (auto) request();
  }, [auto, request]);

  return { position, status, error, request };
}
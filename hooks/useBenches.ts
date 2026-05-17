import { Bench } from '@/models/bench';
import { fetchBenches, type BenchFilters } from '@/services/bench-service';
import { useEffect, useState } from 'react';

export function useBenches(filters?: BenchFilters) {
  const [benches, setBenches] = useState<Bench[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchBenches(filters)
      .then(result => {
        if (active) {
          setBenches(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError('Unable to load benches.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return { benches, loading, error };
}

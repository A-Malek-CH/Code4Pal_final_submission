
import { useQuery } from '@tanstack/react-query';
import { getLocation, getLocations } from '@/lib/supabase/library-sb';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });
}

export function useLocation(locationId: string | null) {
  return useQuery({
    queryKey: ['location', locationId],
    queryFn: () => {
        if (!locationId) return null;
        return getLocation(locationId)
    },
    enabled: !!locationId,
  });
}


import { useQuery } from '@tanstack/react-query';
import { getSourcesForEvent } from '@/lib/supabase/library-sb';

export function useSources(eventId: string | null) {
  return useQuery({
    queryKey: ['sources', eventId],
    queryFn: () => {
        if (!eventId) return [];
        return getSourcesForEvent(eventId)
    },
    enabled: !!eventId,
  });
}

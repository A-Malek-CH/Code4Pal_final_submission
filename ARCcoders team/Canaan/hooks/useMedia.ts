
import { useQuery } from '@tanstack/react-query';
import { getMediaForEvent } from '@/lib/supabase/library-sb';

export function useMedia(eventId: string | null) {
  return useQuery({
    queryKey: ['media', eventId],
    queryFn: () => {
        if (!eventId) return [];
        return getMediaForEvent(eventId)
    },
    enabled: !!eventId,
  });
}


import { useQuery } from '@tanstack/react-query';
import { getEvent, getEvents } from '@/lib/supabase/library-sb';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });
}

export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => {
        if (!eventId) return null;
        return getEvent(eventId);
    },
    enabled: !!eventId,
  });
}

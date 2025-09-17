
import { useQuery } from '@tanstack/react-query';
import { getActor, getActors, getActorsForEvent } from '@/lib/supabase/library-sb';

export function useActors() {
  return useQuery({
    queryKey: ['actors'],
    queryFn: getActors,
  });
}

export function useActor(actorId: string | null) {
  return useQuery({
    queryKey: ['actor', actorId],
    queryFn: () => {
        if (!actorId) return null;
        return getActor(actorId)
    },
    enabled: !!actorId,
  });
}

export function useActorsForEvent(eventId: string | null) {
  return useQuery({
    queryKey: ['actors', 'event', eventId],
    queryFn: () => {
        if (!eventId) return [];
        return getActorsForEvent(eventId)
    },
    enabled: !!eventId,
  });
}

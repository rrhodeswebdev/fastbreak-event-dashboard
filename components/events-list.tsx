import type { Tables } from "@/types/database.types";
import { createClient } from "@/lib/supabase/server";

type Event = Tables<"events">;

export async function EventsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, sport_type, date_time, description, venues, created_at, updated_at, user_id",
    );

  if (error) {
    console.error(error);
    return <div>Error loading events</div>;
  }

  const events: Event[] = data ?? [];

  return <pre>{JSON.stringify(events, null, 2)}</pre>;
}


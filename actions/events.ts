"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TablesInsert } from "@/types/database.types";

export async function createEvent(formData: {
  name: string;
  sport_type: string;
  date_time: string;
  description?: string;
  venues?: string[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "You must be logged in to create an event",
    };
  }

  const eventData: TablesInsert<"events"> = {
    name: formData.name,
    sport_type: formData.sport_type,
    date_time: formData.date_time,
    description: formData.description || null,
    venues: formData.venues || null,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("events")
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return {
      error: error.message || "Failed to create event",
    };
  }

  revalidatePath("/");

  return {
    success: true,
    data,
  };
}


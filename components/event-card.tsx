"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { Tables } from "@/types/database.types";
import { Calendar, MapPin, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { deleteEvent } from "@/actions/events";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { event: Tables<"events"> };

function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export function EventCard({ event }: Props) {
  const { date, time } = formatDateTime(event.date_time);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteEvent(event.id);

      if (result?.error) {
        alert(result.error);
        setIsDeleting(false);
      }
      // If successful, the page will revalidate and the card will disappear
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    if (!isDeleting) {
      router.push(`/event/edit/${event.id}`);
    }
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden relative cursor-pointer"
      onClick={handleCardClick}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )}
      {/* Blurry overlay on hover */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

      {/* View icon in center */}
      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCardClick}
          disabled={isDeleting}
          className="h-12 w-12 bg-background/80 hover:bg-primary/20 text-foreground hover:text-foreground pointer-events-auto"
          aria-label="View event"
        >
          <Eye className="h-6 w-6" />
        </Button>
      </div>

      {/* Delete button in top-right */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Delete event"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors pr-8">
            {event.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 mt-0.5">
            {event.sport_type}
          </Badge>
        </div>
        {event.description && (
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium text-foreground">{date}</span>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <span>{time}</span>
          </div>
        </div>
        {event.venues && event.venues.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {event.venues.map((venue, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground"
                >
                  {venue}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

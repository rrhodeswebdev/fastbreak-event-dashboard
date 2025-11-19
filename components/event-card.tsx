import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { Tables } from "@/types/database.types";
import { Calendar, MapPin } from "lucide-react";

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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {event.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
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

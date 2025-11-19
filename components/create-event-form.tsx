"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createEvent } from "@/actions/events";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  sport_type: z.string().min(1, {
    message: "Please select a sport type.",
  }),
  date_time: z.string().min(1, {
    message: "Please select a date and time.",
  }),
  description: z.string().optional(),
  venues: z.string().optional(),
});

export function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sport_type: "",
      date_time: "",
      description: "",
      venues: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const venuesArray = values.venues
        ? values.venues.split(",").map((v) => v.trim()).filter(Boolean)
        : undefined;

      const result = await createEvent({
        name: values.name,
        sport_type: values.sport_type,
        date_time: values.date_time,
        description: values.description,
        venues: venuesArray,
      });

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        form.reset();
        setIsSubmitting(false);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Fill in the details below to create a new sports event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Basketball Tournament" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your event a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    When will the event take place?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional details about the event..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any additional information about the event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venues (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Court 1, Court 2, Main Arena"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter venue names separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


import { EventForm } from "@/components/event-form";

export default function Page() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
      <div className="w-full max-w-2xl px-4">
        <EventForm />
      </div>
    </div>
  );
}

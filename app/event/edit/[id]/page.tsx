export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-2">Event ID: {id}</p>
        <p className="text-muted-foreground mt-4">
          Edit form coming soon...
        </p>
      </div>
    </div>
  );
}


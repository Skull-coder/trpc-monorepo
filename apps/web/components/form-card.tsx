interface FormCardProps {
  title: string;
  description?: string | null;
  createdAt: Date | string;
}

export function FormCard({ title, description, createdAt }: FormCardProps) {
  const dateStr =
    typeof createdAt === "string"
      ? new Date(createdAt).toLocaleDateString()
      : createdAt.toLocaleDateString();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
      ) : (
        <p className="mt-1 text-sm text-gray-400 italic">No description</p>
      )}
      <p className="mt-3 text-xs text-gray-400">Created {dateStr}</p>
    </div>
  );
}

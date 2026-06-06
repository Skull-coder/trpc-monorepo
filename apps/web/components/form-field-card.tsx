type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

interface FormFieldCardProps {
  label: string;
  labelKey: string;
  type: FieldType;
  description?: string | null;
  isRequired: boolean;
  index: number;
}

export function FormFieldCard({
  label,
  labelKey,
  type,
  description,
  isRequired,
  index,
}: FormFieldCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">#{index}</span>
          <h4 className="text-sm font-semibold text-gray-900">{label}</h4>
          {isRequired && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
              Required
            </span>
          )}
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
          {type}
        </span>
      </div>

      <p className="mt-1 text-xs text-gray-400">Key: {labelKey}</p>

      {description ? (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
      ) : (
        <p className="mt-2 text-sm text-gray-400 italic">No description</p>
      )}
    </div>
  );
}

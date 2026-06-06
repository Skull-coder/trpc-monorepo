"use client";

import { useState } from "react";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

interface CreateFormFieldModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    label: string,
    type: FieldType,
    isRequired: boolean,
    description: string | undefined
  ) => Promise<void>;
  isLoading?: boolean;
}

const FIELD_TYPES: FieldType[] = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"];

export function CreateFormFieldModal({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateFormFieldModalProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("TEXT");
  const [description, setDescription] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  const handleSubmit = async () => {
    const desc = description.trim() || undefined;
    await onSubmit(label.trim(), type, isRequired, desc);
    setLabel("");
    setType("TEXT");
    setDescription("");
    setIsRequired(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isLoading ? undefined : onClose}
      />

      {/* modal */}
      <div className="relative z-50 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">Add Field</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="e.g. Full Name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FieldType)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              disabled={isLoading}
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              placeholder="Optional description"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              disabled={isLoading}
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
              Required field
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!label.trim() || isLoading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Field"}
          </button>
        </div>
      </div>
    </div>
  );
}

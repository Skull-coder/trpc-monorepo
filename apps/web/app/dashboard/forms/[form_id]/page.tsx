"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetFormFields, useCreateFormField } from "hooks/form-fields";
import { FormFieldCard } from "~/components/form-field-card";
import { CreateFormFieldModal } from "~/components/create-form-field-modal";
import { ToastProvider, useToast } from "~/components/toast";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

export default function Page() {
  return (
    <ToastProvider>
      <FormFieldsContent />
    </ToastProvider>
  );
}

function FormFieldsContent() {
  const params = useParams();
  const formId = params.form_id as string;

  const { formFields, isLoading, isError, error } = useGetFormFields(formId);
  const { createFormFieldAsync, isLoading: isCreating } = useCreateFormField();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateFormField = async (
    label: string,
    type: FieldType,
    isRequired: boolean,
    description: string | undefined
  ) => {
    try {
      await createFormFieldAsync({
        formId,
        label,
        type,
        description,
        isRequired,
      });
      toast("Field added successfully", "success");
      setModalOpen(false);
    } catch {
      toast("Failed to add field", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/forms"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Form Fields</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add Field
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-sm text-gray-500">Loading fields...</p>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-sm text-red-600">
          {error?.message ?? "Something went wrong loading fields."}
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && formFields?.length === 0 && (
        <p className="text-sm text-gray-500">
          No fields yet. Add one to start building your form.
        </p>
      )}

      {/* Fields list */}
      {!isLoading && formFields && formFields.length > 0 && (
        <div className="flex flex-col gap-3">
          {formFields.map((field) => (
            <FormFieldCard
              key={field.id}
              label={field.label}
              labelKey={field.labelKey}
              type={field.type}
              description={field.description}
              isRequired={field.isRequired}
              index={field.index}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <CreateFormFieldModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateFormField}
        isLoading={isCreating}
      />
    </div>
  );
}

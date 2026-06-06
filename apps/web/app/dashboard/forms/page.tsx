"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetForms, useCreateForm } from "hooks/form";
import { FormCard } from "~/components/form-card";
import { CreateFormModal } from "~/components/create-form-modal";
import { ToastProvider, useToast } from "~/components/toast";

export default function Page() {
  return (
    <ToastProvider>
      <FormsContent />
    </ToastProvider>
  );
}

function FormsContent() {
  const { forms, isLoading, isError, error } = useGetForms();
  const { createFormAsync, isLoading: isCreating } = useCreateForm();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateForm = async (
    title: string,
    description: string | undefined
  ) => {
    try {
      await createFormAsync({ title, description });
      toast("Form created successfully", "success");
      setModalOpen(false);
    } catch {
      toast("Failed to create form", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Forms</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Create Form
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="text-sm text-gray-500">Loading forms...</p>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-sm text-red-600">
          {error?.message ?? "Something went wrong loading forms."}
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && forms?.length === 0 && (
        <p className="text-sm text-gray-500">No forms yet. Create one to get started.</p>
      )}

      {/* Forms grid */}
      {!isLoading && forms && forms.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Link key={form.id} href={`/dashboard/forms/${form.id}`}>
              <FormCard
                title={form.title}
                description={form.description}
                createdAt={form.createdAt}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Create modal */}
      <CreateFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateForm}
        isLoading={isCreating}
      />
    </div>
  );
}

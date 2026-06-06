import { trpc } from "~/trpc/client";

export const useCreateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormFieldAsync,
    error,
    isIdle,
    isError,
    isLoading,
  } = trpc.formFields.createFormField.useMutation({
    onSuccess: () => {
      utils.formFields.getFormFields.invalidate();
    },
  });

  return {
    createFormFieldAsync,
    isIdle,
    isLoading,
    isError,
    error,
  };
};

export const useGetFormFields = (formId: string) => {
  const {
    data: formFields,
    error,
    isError,
    isLoading,
    isSuccess,
    isPaused,
    status,
    dataUpdatedAt,
    fetchStatus,
  } = trpc.formFields.getFormFields.useQuery(
    { formId },
    { staleTime: 5 * 60 * 1000 }
  );

  return {
    formFields,
    isLoading,
    isError,
    error,
    status,
  };
};

export const useUpdateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormFieldAsync,
    error,
    isIdle,
    isError,
  } = trpc.formFields.updateFormField.useMutation({
    onSuccess: () => {
      utils.formFields.getFormFields.invalidate();
    },
  });

  return {
    updateFormFieldAsync,
  };
};

export const useDeleteFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormFieldAsync,
    error,
    isIdle,
    isError,
  } = trpc.formFields.deleteFormField.useMutation({
    onSuccess: () => {
      utils.formFields.getFormFields.invalidate();
    },
  });

  return {
    deleteFormFieldAsync,
  };
};

export const useReorderFormFields = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: reorderFormFieldsAsync,
    error,
    isIdle,
    isError,
  } = trpc.formFields.reorderFormFields.useMutation({
    onSuccess: () => {
      utils.formFields.getFormFields.invalidate();
    },
  });

  return {
    reorderFormFieldsAsync,
  };
};

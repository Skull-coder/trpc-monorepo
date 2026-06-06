import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    error,
    isIdle,
    isError,
    isLoading,
  } = trpc.forms.createForm.useMutation({
    onSuccess: () => {
      utils.forms.getForms.invalidate();
    },
  });

  return {
    createFormAsync,
    isIdle,
    isLoading,
    isError,
    error,
  };
};

export const useGetForms = () => {
  const {
    data: forms,
    error,
    isError,
    isLoading,
    isSuccess,
    isPaused,
    status,
    dataUpdatedAt,
    fetchStatus,
  } = trpc.forms.getForms.useQuery(undefined, { staleTime: 5 * 60 * 1000 });

  return {
    forms,
    isLoading,
    isError,
    error,
    status,
  };
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormAsync,
    error,
    isIdle,
    isError,
  } = trpc.forms.updateForm.useMutation({
    onSuccess: () => {
      utils.forms.getForms.invalidate();
    },
  });

  return {
    updateFormAsync,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormAsync,
    error,
    isIdle,
    isError,
  } = trpc.forms.deleteForm.useMutation({
    onSuccess: () => {
      utils.forms.getForms.invalidate();
    },
  });

  return {
    deleteFormAsync,
  };
};

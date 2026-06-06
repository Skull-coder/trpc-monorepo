import { trpc } from "~/trpc/client";

export const useSubmitForm = () => {
  const {
    mutateAsync: submitFormAsync,
    error,
    isIdle,
    isError,
  } = trpc.submission.submitForm.useMutation();

  return {
    submitFormAsync,
  };
};

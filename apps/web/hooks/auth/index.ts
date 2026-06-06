import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    error,
    isIdle,
    isError,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: () => {
      utils.auth.loggedInUserInfo.invalidate();
    },
  });

  return {
    createUserWithEmailAndPasswordAsync,
  };
};

export const useLogin = () => {

  const utils = trpc.useUtils();


  const {
    mutateAsync: signinUserWithEmailAndPasswordAsync,
    error,
    isError,
    isSuccess,
    isIdle,
    isPaused,
  } = trpc.auth.signinUserWithEmailAndPassword.useMutation({
    onSuccess: async()=>{
      utils.auth.loggedInUserInfo.invalidate()
    }
  });

  return {
    signinUserWithEmailAndPasswordAsync,
  };
};

export const getUser = () => {
  const {
    data: user,
    error,
    isError,
    isSuccess,
    isPaused,
    status,
    dataUpdatedAt,
    fetchStatus
  } = trpc.auth.loggedInUserInfo.useQuery(undefined, { staleTime: 5 * 60 * 1000 });


  return {
    user,
  };
};

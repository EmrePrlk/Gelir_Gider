import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';

import { useBoolean } from 'src/hooks/use-boolean';

import { paths } from 'src/config/paths';
import { login } from 'src/services/auth';
import { useAuthStore } from 'src/stores/auth-store';

export function useLoginForm() {
  const router = useRouter();
  const [setTokens, setUser] = useAuthStore(state => [
    state.setTokens,
    state.setUser,
  ]);
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || paths.dashboard.root;
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { reset, handleSubmit } = methods;

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ tokens, user }) => {
      setTokens(tokens);
      setUser(user!);
      router.push(returnTo || paths.dashboard.root);
    },
    onError: error => {
      reset();
      // TODO: Format error message

      setErrorMsg(
        // eslint-disable-next-line no-nested-ternary
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred',
      );
    },
  });

  const onSubmit = handleSubmit(data => loginMutation.mutate(data));

  return {
    methods,
    errorMsg,
    isSubmitting: loginMutation.isPending,
    password,
    onSubmit,
  };
}

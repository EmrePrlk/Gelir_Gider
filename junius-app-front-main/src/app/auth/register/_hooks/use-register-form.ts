'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { useBoolean } from 'src/hooks/use-boolean';

import { paths } from 'src/config/paths';
import { register } from 'src/services/auth';
import { useAuthStore } from 'src/stores/auth-store'; // Assuming signup is the API call function

import { passwordValidator } from 'src/utils/password-validator';

import { Status } from 'src/definitions';

import { type IRegisterRequest } from 'src/types/auth';

export default function useRegisterForm() {
  const router = useRouter();
  const [setUser, setTokens] = useAuthStore(state => [
    state.setUser,
    state.setTokens,
  ]);

  const [errorMsg, setErrorMsg] = useState<string>('');

  const password = useBoolean();
  const passwordConfirmation = useBoolean();

  const RegisterSchema = Yup.object().shape({
    first_name: Yup.string().required('First name required'),
    last_name: Yup.string().required('Last name required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    password: passwordValidator.required('Password is required'),
    password_confirmation: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues: IRegisterRequest = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  const methods = useForm<IRegisterRequest>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const signUpMutation = useMutation({
    mutationFn: register,
    onSuccess: async ({ tokens, user }) => {
      setTokens(tokens);
      setUser(user);
      router.push(paths.landing.root);
    },
    onError: error => {
      reset();
      // TODO: Format error message
      if (typeof error === 'string') {
        setErrorMsg(error);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown error occurred');
      }
    },
  });

  const onSubmit = handleSubmit((data: IRegisterRequest) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.status = Status.INACTIVE;
    signUpMutation.mutate(data);
  });

  return {
    onSubmit,
    isSubmitting: signUpMutation.isPending,
    errorMsg,
    methods,
    password,
    passwordConfirmation,
  };
}

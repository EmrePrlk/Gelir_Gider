import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSnackbar } from 'src/components/snackbar';

import { type IUser } from 'src/types/user';

import { useManagedUser } from '../../../_context/use-managed-user';

export function useManageAccountSecurityEmailForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState('');
  const { user, setUser } = useManagedUser();

  const ChangeEmailSchema = Yup.object().shape({
    newEmail: Yup.string()
      .required('Email cannot be empty')
      .email('Please enter a valid email address')
      .test(
        'is-different-or-same',
        'New email must be different or the same as the current email',
        // eslint-disable-next-line func-names
        value => value !== user?.email,
      ),
  });

  const defaultValues = useMemo(
    () => ({
      newEmail: '',
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(ChangeEmailSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (user) {
      reset({
        newEmail: user.email,
      });
    }
  }, [reset, user]);

  // TODO: Implement this EMAIL change mutation
  const updateUserMutation = useMutation({
    mutationFn: (_data: { newEmail: string }): Promise<IUser> =>
      new Promise((resolve, reject) => {
        setTimeout(
          () => (user ? resolve(user) : reject(new Error('User not found'))),
          500,
        );
      }),
    onSuccess: (updatedUser: IUser) => {
      setUser?.(updatedUser);
      enqueueSnackbar('Email change message sent, please check your email');
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => updateUserMutation.mutate(data));

  return {
    methods,
    isSubmitting: updateUserMutation.isPending,
    onSubmit,
    errorMsg,
  };
}

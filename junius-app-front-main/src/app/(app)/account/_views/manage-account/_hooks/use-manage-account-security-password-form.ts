import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { passwordValidator } from 'src/utils/password-validator';

import { useSnackbar } from 'src/components/snackbar';

import { type IUser } from 'src/types/user';

import { useManagedUser } from '../../../_context/use-managed-user';

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function useManageAccountSecurityPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useManagedUser();
  const [errorMsg, setErrorMsg] = useState('');

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: passwordValidator
      .required('New Password is required')
      .test(
        'no-match',
        'New password must be different than old password',
        (value, { parent }) => value !== (parent as FormValues).oldPassword,
      ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      'Passwords must match',
    ),
  });

  const defaultValues: FormValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  // TODO: Implement this PASSWORD change mutation
  const updateUserMutation = useMutation({
    mutationFn: (_data: { newPassword: string }): Promise<IUser> =>
      new Promise((resolve, reject) => {
        setTimeout(
          () => (user ? resolve(user) : reject(new Error('User not found'))),
          500,
        );
      }),
    onSuccess: (updatedUser: IUser) => {
      setUser?.(updatedUser);
      enqueueSnackbar('Password updated successfully');
      window.location.reload();
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

import * as Yup from 'yup';
import { pick } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { phoneRegex } from 'src/utils/regex';

import { defineUser } from 'src/services/user';
import { MAX_FILE_SIZE } from 'src/config/constants';

import { useSnackbar } from 'src/components/snackbar';

import { type IUser } from 'src/types/user';

import { useManagedUser } from '../../../_context/use-managed-user';

// ----------------------------------------------------------------------

export function useManageAccountGeneralForm() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, setUser } = useManagedUser();

  const [errorMsg, setErrorMsg] = useState('');

  const UpdateUserSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('First Name is required')
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    last_name: Yup.string()
      .required('Last Name is required')
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    phone_number: Yup.string()
      .required('Phone Number is required')
      .matches(phoneRegex(), 'Invalid Phone Number'),
    country: Yup.string().required('Country is required'),
    state_region: Yup.string().required('State/Region is required'),
    city: Yup.string().required('City is required'),
    address: Yup.string()
      .required('Address is required')
      .min(15, 'Minimum 15 characters')
      .max(255, 'Maximum 255 characters'),
    zip_code: Yup.string()
      .required('Zip/Code is required')
      .max(9, 'Invalid Zip code'),
    profile_picture: Yup.mixed<File | string>()
      // eslint-disable-next-line func-names
      .test('fileOrString', 'Invalid profile picture', function (value) {
        if (typeof value === 'string') {
          return true; // Accept existing URL strings
        }
        if (value instanceof File) {
          // File type check
          const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          if (!validTypes.includes(value.type)) {
            return this.createError({
              message: 'Only image files are allowed',
            });
          }
          // File size check
          if (value.size > MAX_FILE_SIZE) {
            return this.createError({
              message: 'File size must be less than 5MB',
            });
          }
          return true;
        }
        return value === null; // Allow null values
      })
      .nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      phone_number: '',
      country: '',
      state_region: '',
      city: '',
      address: '',
      zip_code: '',
      profile_picture: null,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  useEffect(() => {
    const userData = pick(user, Object.keys(defaultValues));
    if (user) {
      methods.reset({
        ...userData,
      });
    }
  }, [defaultValues, methods, user]);

  const { setValue, handleSubmit } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = file
        ? Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        : null;

      if (newFile) {
        setValue('profile_picture', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => {
      const formData = new FormData();

      // If the profile picture is a string, the picture is not updated
      if (data.profile_picture && typeof data.profile_picture === 'string') {
        data.profile_picture = undefined;
      }

      // append all data to formData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          }
          // Array of files
          else if (Array.isArray(value)) {
            value.forEach(file => {
              if (file instanceof File || file instanceof Blob) {
                formData.append(key, file);
              }
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      return defineUser(user?.id!, formData);
    },
    onSuccess: (updatedUser: IUser) => {
      setUser?.(updatedUser);
      enqueueSnackbar('Account updated successfully!');
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => updateUserMutation.mutate(data));

  return {
    methods,
    isSubmitting: updateUserMutation.isPending,
    onSubmit,
    errorMsg,
    handleDrop,
  };
}

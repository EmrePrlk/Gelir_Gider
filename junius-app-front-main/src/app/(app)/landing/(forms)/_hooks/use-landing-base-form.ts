import * as Yup from 'yup';
import { pick } from 'lodash';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { phoneRegex } from 'src/utils/regex';

import { paths } from 'src/config/paths';
import { defineUser } from 'src/services/user';
import { useAuthStore } from 'src/stores/auth-store';
import { Status, type RoleGroupEnum } from 'src/definitions';
import { useDefinitionStore } from 'src/stores/definition-store';

import { type IUser } from 'src/types/user';

import useLandingItem from './use-landing-item';

export default function useLandingBaseForm(
  additionalSchema: Yup.ObjectShape = {},
  additionalDefaultValues = {},
) {
  const [user, setUser] = useAuthStore(state => [state.user, state.setUser]);
  const [educationLevels, preferedTitleExperiences] = useDefinitionStore(
    state => [state.educationLevels, state.preferedTitleExperiences],
  );
  const roleGroup = useLandingItem();
  const [errorMsg, setErrorMsg] = useState('');

  const BaseSchema = {
    first_name: Yup.string()
      .required('First Name is required')
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    last_name: Yup.string()
      .required('Last Name is required')
      .min(3, 'Minimum 3 characters')
      .max(50, 'Maximum 50 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
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
    education_level: Yup.number()
      .required('Education is required')
      .oneOf(
        educationLevels.map(level => level.id),
        'Invalid education level',
      ),
    prefered_title_experience: Yup.string()
      .required('Experience is required')
      .oneOf(
        preferedTitleExperiences.map(exp => exp.id),
        'Invalid experience level',
      ),
  };

  const LandingSchema = Yup.object().shape({
    ...BaseSchema,
    ...additionalSchema,
  });

  const defaultValues = useMemo(() => {
    const baseDefaultValues = {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      country: '',
      state_region: '',
      city: '',
      address: '',
      zip_code: '',
      education_level: '',
      prefered_title_experience: '',
    };
    return { ...baseDefaultValues, ...additionalDefaultValues };
  }, [additionalDefaultValues]);

  const methods = useForm({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    resolver: yupResolver(LandingSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      const userData = pick(user, Object.keys(defaultValues));
      const filteredUserData = {
        ...defaultValues,
        ...Object.fromEntries(
          Object.entries(userData).filter(([_, value]) => value != null),
        ),
      };
      methods.reset(filteredUserData);
    }
  }, [defaultValues, methods, user]);

  const { handleSubmit } = methods;

  const router = useRouter();

  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => {
      data.type_of_user = roleGroup?.id as RoleGroupEnum;
      data.status = Status.PENDING;

      const formData = new FormData();

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
      setUser(updatedUser);
      router.push(paths.landing.approval);
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    updateUserMutation.mutate(data);
  });

  return {
    methods,
    isSubmitting: updateUserMutation.isPending,
    onSubmit,
    errorMsg,
  };
}

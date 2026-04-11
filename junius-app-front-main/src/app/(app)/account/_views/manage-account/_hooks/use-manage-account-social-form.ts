import * as Yup from 'yup';
import { pick } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  githubRegex,
  twitterRegex,
  linkedinRegex,
  facebookRegex,
  instagramRegex,
} from 'src/utils/regex';

import { updateUser } from 'src/services/user';

import { useSnackbar } from 'src/components/snackbar';

import { type IUser, type IUserSocialLink } from 'src/types/user';

import { useManagedUser } from '../../../_context/use-managed-user';

export default function useManageAccountSocialForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState('');
  const { user, setUser } = useManagedUser();

  const UpdateUserSchema = Yup.object().shape({
    facebook_link: Yup.string()
      .matches(
        facebookRegex,
        'Invalid Facebook URL (e.g. https://www.facebook.com/username)',
      )
      .nullable()
      .transform(value => (value === '' ? null : (value as string))),
    instagram_link: Yup.string()
      .matches(
        instagramRegex,
        'Invalid Instagram URL (e.g. https://www.instagram.com/username)',
      )
      .nullable()
      .transform(value => (value === '' ? null : (value as string))),
    linkedin_link: Yup.string()
      .matches(
        linkedinRegex,
        'Invalid LinkedIn URL (e.g. https://www.linkedin.com/in/username)',
      )
      .nullable()
      .transform(value => (value === '' ? null : (value as string))),

    twitter_link: Yup.string()
      .matches(
        twitterRegex,
        'Invalid Twitter URL (e.g. https://www.twitter.com/username)',
      )
      .nullable()
      .transform(value => (value === '' ? null : (value as string))),

    github_link: Yup.string()
      .matches(
        githubRegex,
        'Invalid GitHub URL (e.g. https://www.github.com/username)',
      )
      .nullable()
      .transform(value => (value === '' ? null : (value as string))),
  });

  const defaultValues: IUserSocialLink = useMemo(
    () => ({
      facebook_link: null,
      instagram_link: null,
      linkedin_link: null,
      twitter_link: null,
      github_link: null,
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

  const { handleSubmit } = methods;

  const updateUserMutation = useMutation({
    mutationFn: (data: IUserSocialLink) => {
      // eslint-disable-next-line unicorn/no-array-reduce
      const socialLinks = Object.entries(data).reduce<IUserSocialLink>(
        (acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key as keyof IUserSocialLink] = value;
          }
          return acc;
        },
        {} as IUserSocialLink,
      );

      return updateUser(user?.id!, socialLinks);
    },
    onSuccess: (updatedUser: IUser) => {
      setUser?.(updatedUser);
      enqueueSnackbar('Social links updated successfully!');
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => updateUserMutation.mutate(data));

  return {
    methods,
    isSubmitting: updateUserMutation.isPending,
    onSubmit,
    errorMsg,
    socialLinks: defaultValues,
  };
}

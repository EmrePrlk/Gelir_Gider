import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import buildFormData from 'src/utils/form-data-builder';

import { paths } from 'src/config/paths';
import { Status, Industry } from 'src/definitions';
import { useAuthStore } from 'src/stores/auth-store';
import { createIdea, updateIdea } from 'src/services/idea';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from 'src/config/constants';

import { type IIdea } from 'src/types/idea';

export function useIdeaForm(ideaData?: IIdea) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [user] = useAuthStore(state => [state.user]);
  const { enqueueSnackbar } = useSnackbar();

  const IdeaSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    summary: Yup.string().required('Summary is required'),
    detail: Yup.string().required('Detail is required'),
    category: Yup.string()
      .oneOf(
        Object.values(Industry),
        'Please select a category that best suits your idea.',
      )
      .required('Category is required'),
    possible_competitor: Yup.string().required(
      'Possible Competitor is required',
    ),
    target_investment: Yup.number()
      .required('Target Investment is required')
      .min(1000, 'Target Investment must be greater than 1000$'),
    document_link: Yup.mixed()
      .test('fileType', 'Only document or image files are allowed', value => {
        if (value && value instanceof File) {
          return ALLOWED_FILE_TYPES.includes(value.type);
        }
        return true;
      })
      .test('fileSize', 'File size must be less than 5MB', value => {
        if (value && value instanceof File) {
          return value.size <= MAX_FILE_SIZE;
        }
        return true;
      })
      .test('fileCount', 'Maximum 5 files are allowed', value => {
        if (value && value instanceof FileList) {
          return value.length <= 5;
        }
        return true;
      })
      .required('At least one file is required'),
  });

  type IdeaFormData = Yup.InferType<typeof IdeaSchema>;

  const defaultValues: IdeaFormData = {
    title: '',
    summary: '',
    detail: '',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    category: '',
    possible_competitor: '',
    target_investment: 0,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document_link: null,
  };

  const methods = useForm({
    resolver: yupResolver(IdeaSchema),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (ideaData) {
      reset(ideaData);
    }
  }, [ideaData, reset]);

  const ideaMutation = useMutation({
    mutationFn: (data: IIdea) => {
      if (ideaData) {
        return updateIdea(ideaData.id, {
          ...data,
          user_id: user?.id,
        });
      }
      return createIdea(
        buildFormData({
          ...data,
          user_id: user?.id,
          status: Status.ACTIVE,
        }),
      );
    },
    onSuccess: updatedIdea => {
      enqueueSnackbar(`Idea ${ideaData ? 'updated' : 'created'} successfully`, {
        variant: 'success',
      });
      router.push(paths.dashboard.ideas.view(updatedIdea.id.toString()));
    },
    onError: error => setErrorMsg(error.message),
  });

  const onSubmit = handleSubmit(data => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ideaMutation.mutate(data);
  });

  return { methods, onSubmit, errorMsg, submitting: ideaMutation.isPending };
}

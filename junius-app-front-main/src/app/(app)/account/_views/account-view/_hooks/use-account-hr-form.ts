import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useBoolean } from 'src/hooks/use-boolean';

import { createUserNote } from 'src/services/hr';
import { useAuthStore } from 'src/stores/auth-store';

import { type IUserNote, type IUserNotePost } from 'src/types/user'; // Assume this function exists

import { format } from 'date-fns';

import { useManagedUser } from 'src/app/(app)/account/_context/use-managed-user'; // Add this import

export const useAccountHRForm = (hrOpinions: IUserNote[]) => {
  const edit = useBoolean();
  const { user: managedUser } = useManagedUser();
  const [user] = useAuthStore(state => [state.user]);
  const queryClient = useQueryClient();

  const Schema = Yup.object().shape({
    note_detail: Yup.string()
      .required('Opinion is required')
      .min(10, 'Opinion should be at least 10 characters')
      .max(300, 'Opinion should be at most 300 characters'),
  });

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      note_detail: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const mutation = useMutation({
    mutationFn: (data: IUserNotePost) => createUserNote(data),
    onSuccess: () => {
      edit.onFalse();
      reset();
      void queryClient.invalidateQueries({
        queryKey: ['account-note', managedUser?.id!],
      });
    },
  });

  const onSubmit = handleSubmit(data => {
    const newNote: IUserNotePost = {
      user_id: managedUser?.id!,
      note_owner_user_id: user?.id!,
      note_date: format(new Date(), 'yyyy-MM-dd'), // Use date-fns to format the date
      note_detail: data.note_detail.trim(),
    };
    mutation.mutate(newNote);
  });

  const handleEditClick = () => {
    edit.onTrue();
    reset();
  };

  const handleCancelClick = () => {
    edit.onFalse();
    reset();
  };

  const formattedOpinions = hrOpinions.map(opinion => ({
    id: opinion.id.toString(),
    title: new Date(opinion.note_date).toLocaleDateString(),
    text: opinion.note_detail,
  }));

  return {
    edit,
    methods,
    onSubmit,
    handleEditClick,
    handleCancelClick,
    formattedOpinions,
    loading: mutation.isPending,
  };
};

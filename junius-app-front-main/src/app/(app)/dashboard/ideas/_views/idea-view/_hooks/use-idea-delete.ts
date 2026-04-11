import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paths } from 'src/config/paths';
import { deleteIdea } from 'src/services/idea';

interface UseIdeaDeleteProps {
  ideaId: number;
}

export function useIdeaDelete({ ideaId }: UseIdeaDeleteProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: async () => {
      enqueueSnackbar('Idea deleted successfully!', { variant: 'success' });
      await queryClient.invalidateQueries({ queryKey: ['ideas-list'] });
      void router.push(paths.dashboard.ideas.root);
    },
    onError: () => {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    },
  });

  return { mutate, isLoading: isPending };
}

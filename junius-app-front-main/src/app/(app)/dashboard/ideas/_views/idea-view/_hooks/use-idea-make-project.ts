import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paths } from 'src/config/paths';
import { idea2Project } from 'src/services/idea';

import { type IIdeaToProjectRequest } from 'src/types/idea';

interface UseIdeaMakeProjectProps {
  ideaId: number;
}

export function useIdeaMakeProject({ ideaId }: UseIdeaMakeProjectProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Omit<IIdeaToProjectRequest, 'idea_id'>) =>
      idea2Project({ ...data, idea_id: ideaId }),
    onSuccess: async () => {
      enqueueSnackbar('Idea successfully converted to project!', {
        variant: 'success',
      });
      await queryClient.invalidateQueries({ queryKey: ['ideas-list'] });
      await queryClient.invalidateQueries({ queryKey: ['projects-list'] });
      void router.push(paths.dashboard.projects.root);
    },
    onError: () => {
      enqueueSnackbar('Failed to convert idea to project', {
        variant: 'error',
      });
    },
  });

  return { mutate, isLoading: isPending };
}

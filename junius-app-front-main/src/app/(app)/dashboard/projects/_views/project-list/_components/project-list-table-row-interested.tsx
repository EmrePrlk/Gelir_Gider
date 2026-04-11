import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IconButton } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';

import { useAuthStore } from 'src/stores/auth-store';
import { useProjectListStore } from 'src/stores/project-list-store';
import {
  addInterestedProject,
  removeInterestedProject,
} from 'src/services/projects';

import { type IProjectListResponse } from 'src/types/project';

export interface ProjectListTableRowInterestedProps {
  projectId: number;
  interested: boolean;
  interestedId: number | undefined;
}

export default function ProjectListTableRowInterested(
  props: ProjectListTableRowInterestedProps,
) {
  const [filters, page] = useProjectListStore(state => [
    state.filters,
    state.page,
  ]);

  const [userId] = useAuthStore(state => [state.user?.id]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      props.interested
        ? removeInterestedProject(props.interestedId)
        : addInterestedProject(props.projectId, userId!),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['projects-list', { page, ...filters }],
      });

      const previousProjects = queryClient.getQueryData<IProjectListResponse>([
        'projects-list',
        { page, ...filters },
      ]);

      queryClient.setQueryData<IProjectListResponse>(
        ['projects-list', { page, ...filters }],
        old => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map(project =>
              project.id === props.projectId
                ? {
                    ...project,
                    interestedId: props.interested ? undefined : 123,
                    interested: !props.interested,
                  }
                : project,
            ),
          };
        },
      );

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['projects-list', { page, ...filters }],
        context?.previousProjects,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['projects-list', { page, ...filters }],
      }),
  });

  return (
    <IconButton
      onClick={() => !isPending && mutate()}
      size="large"
      aria-label="interested"
    >
      <StarsIcon
        sx={{
          color: props.interested ? '#FFAB00' : '#C4CDD5',
        }}
      />
    </IconButton>
  );
}

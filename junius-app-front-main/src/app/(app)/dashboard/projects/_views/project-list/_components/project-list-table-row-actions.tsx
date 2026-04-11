import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, MenuItem, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Can from 'src/lib/casl/can';
import { paths } from 'src/config/paths';
import { deleteProject } from 'src/services/projects';
import { useAbility } from 'src/lib/casl/use-ability';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

interface Props {
  projectId: number;
}

export function ProjectListTableRowActions({ projectId }: Props) {
  const queryClient = useQueryClient();

  const popover = usePopover();
  const confirm = useBoolean();
  const router = useRouter();
  const ability = useAbility();

  const allowed = ability.can('update', 'project');

  const handleEditRow = () => {
    if (!allowed) {
      enqueueSnackbar('You are not allowed to edit this project', {
        variant: 'error',
      });
      return;
    }
    router.push(paths.dashboard.projects.edit(projectId.toString()));
  };

  const handleViewRow = () => {
    router.push(paths.dashboard.projects.view(projectId.toString()));
  };

  const { mutate: deleteProjectMutation, isPending } = useMutation({
    mutationFn: () => {
      if (!allowed) {
        return Promise.reject(
          new Error('You are not allowed to delete this project'),
        );
      }
      return deleteProject(projectId);
    },
    onError: () => {
      enqueueSnackbar('Failed to delete project', { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Project deleted successfully', { variant: 'success' });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['projects-list'] }),
  });

  return (
    <>
      <IconButton
        color={popover.open ? 'inherit' : 'default'}
        onClick={popover.onOpen}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleViewRow}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <Can I="delete" a="project">
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem onClick={handleEditRow}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </Can>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteProjectMutation()}
            disabled={isPending}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

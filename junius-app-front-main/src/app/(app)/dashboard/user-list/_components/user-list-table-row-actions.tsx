import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, MenuItem, TableCell, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { paths } from 'src/config/paths';
import { deleteUser } from 'src/services/user';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

interface Props {
  userId: number;
}

export function UserListTableRowActions({ userId }: Props) {
  const queryClient = useQueryClient();

  const popover = usePopover();
  const confirm = useBoolean();
  const router = useRouter();

  const handleEditRow = () => {
    router.push(paths.account.edit(userId.toString()));
  };

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: () => deleteUser(userId),
    onError: () => {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['management-users-list'] }),
  });

  return (
    <>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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
            onClick={() => deleteUserMutation()}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Select,
  MenuItem,
  TableCell,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';

import { Status } from 'src/definitions';
import { updateUser } from 'src/services/user';

import Label from 'src/components/label';

export interface UserListTableRowStatusProps {
  userId: number;
  currentStatus: Status;
  setLoading: (isLoading: boolean) => void;
}

export default function UserListTableRowStatus(
  props: UserListTableRowStatusProps,
) {
  const queryClient = useQueryClient();

  const { mutate: updateUserStatusMutation } = useMutation({
    mutationFn: (newStatus: Status) =>
      updateUser(props.userId, { status: newStatus }),

    onMutate: () => {
      props.setLoading(true);
    },
    onError: () => {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    },
    onSettled: () => {
      props.setLoading(false);
      return queryClient.invalidateQueries({
        queryKey: ['management-users-list'],
      });
    },
    onSuccess: () => {
      enqueueSnackbar('Status updated successfully', { variant: 'success' });
    },
  });

  const handleStatusChange = (event: SelectChangeEvent<Status>) => {
    const newStatus = event.target.value as Status;
    updateUserStatusMutation(newStatus);
  };

  return (
    <TableCell>
      <FormControl variant="outlined" size="small">
        <Select
          value={props.currentStatus}
          onChange={handleStatusChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          renderValue={selectedStatus => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: getUserStatusColor(selectedStatus),
                  marginRight: 8,
                }}
              />
              <Label
                variant="soft"
                sx={{
                  bgcolor: 'inherit',
                }}
              >
                {selectedStatus}
              </Label>
            </div>
          )}
        >
          {Object.values(Status).map(status => (
            <MenuItem key={status} value={status}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: getUserStatusColor(status),
                    marginRight: 8,
                  }}
                />
                {status}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </TableCell>
  );
}

const getUserStatusColor = (status: Status): string => {
  switch (status) {
    case Status.ACTIVE: {
      return 'green';
    }
    case Status.PENDING: {
      return 'orange';
    }
    case Status.SUSPENDED: {
      return 'red';
    }
    case Status.REJECTED: {
      return 'red';
    }
    case Status.INACTIVE: {
      return 'grey';
    }
    default: {
      return 'grey';
    }
  }
};

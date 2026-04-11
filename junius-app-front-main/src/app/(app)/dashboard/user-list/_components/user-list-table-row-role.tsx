import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Select,
  MenuItem,
  TableCell,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';

import { updateUser } from 'src/services/user';
import { RoleGroupEnum, getRoleGroupById } from 'src/definitions';

import Label from 'src/components/label';

export interface UserListTableRowRoleProps {
  userId: number;
  currentRoleGroup: RoleGroupEnum | null; // Change -1 to null
  setLoading: (isLoading: boolean) => void;
}

export default function UserListTableRowRole(props: UserListTableRowRoleProps) {
  const queryClient = useQueryClient();

  const { mutate: updateUserRoleGroupMutation } = useMutation({
    mutationFn: (newRoleGroup: RoleGroupEnum) =>
      updateUser(props.userId, { type_of_user: newRoleGroup }),

    onMutate: () => {
      props.setLoading(true);
    },
    onError: () => {
      enqueueSnackbar('Failed to update role', { variant: 'error' });
    },
    onSettled: () => {
      props.setLoading(false);
      return queryClient.invalidateQueries({
        queryKey: ['management-users-list'],
      });
    },
    onSuccess: () => {
      enqueueSnackbar('Role updated successfully', { variant: 'success' });
    },
  });

  const handleRoleChange = (event: SelectChangeEvent<number>) => {
    const newRoleGroup = event.target.value;
    updateUserRoleGroupMutation(Number(newRoleGroup));
  };

  return (
    <TableCell>
      <FormControl variant="outlined" size="small">
        <Select
          value={props.currentRoleGroup ?? ''} // Use nullish coalescing
          onChange={handleRoleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          renderValue={selectedRoleGroup => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: getUserRoleColor(
                    selectedRoleGroup as RoleGroupEnum | null,
                  ),
                }}
              />
              <Label
                variant="soft"
                sx={{
                  bgcolor: 'inherit',
                }}
              >
                {selectedRoleGroup
                  ? getRoleGroupById(Number(selectedRoleGroup))?.name
                  : 'No Role'}
              </Label>
            </div>
          )}
        >
          <MenuItem value="">
            <em>No Role</em>
          </MenuItem>
          {Object.values(RoleGroupEnum).map(option => {
            const roleGroup = getRoleGroupById(option as number);
            return roleGroup ? (
              <MenuItem key={option} value={option}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getUserRoleColor(
                        option as RoleGroupEnum,
                      ),
                      marginRight: 8,
                    }}
                  />
                  {roleGroup.name}
                </div>
              </MenuItem>
            ) : null;
          })}
        </Select>
      </FormControl>
    </TableCell>
  );
}

const getUserRoleColor = (roleGroup: RoleGroupEnum | null): string => {
  switch (roleGroup) {
    case RoleGroupEnum.DEVELOPER: {
      return 'green';
    }
    case RoleGroupEnum.IDEATOR: {
      return 'blue';
    }
    case RoleGroupEnum.INVESTOR: {
      return 'purple';
    }
    case RoleGroupEnum.ADMIN: {
      return 'orange';
    }
    case RoleGroupEnum.SUPER_ADMIN: {
      return 'red';
    }
    default: {
      return 'grey';
    }
  }
};

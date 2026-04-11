'use client';
import { useState } from 'react';

import { Stack } from '@mui/system';
import {
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

import WelcomeBar from 'src/app/(app)/_components/welcome-bar';
import { useDefinitionStore } from 'src/stores/definition-store';
import { MaintenanceIllustration } from 'src/assets/illustrations';

interface PermissionsHeaderProps {
  onRoleChange: (roleId: number) => void;
}

export default function PermissionsHeader({
  onRoleChange,
}: PermissionsHeaderProps) {
  const [roleGroups] = useDefinitionStore(state => [state.roleGroups]);
  const [selectedRole, setSelectedRole] = useState<number | ''>('');

  const handleRoleChange = (roleId: number) => {
    setSelectedRole(roleId);
    onRoleChange(roleId);
  };

  return (
    <Stack direction="column" spacing={3}>
      <WelcomeBar
        title="Edit Roles and Permissions"
        description="Update Junius App roles and permissions, to start managing your permissions, select a role from the dropdown below."
      >
        <MaintenanceIllustration />
      </WelcomeBar>

      <Typography
        variant="h4"
        color="text.primary"
        sx={{ textTransform: 'capitalize' }}
      >
        {selectedRole
          ? `${roleGroups.find(role => role.id === selectedRole)?.name} Permissions`
          : 'Please select a role below'}
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="role-select-label">Role Name</InputLabel>
        <Select
          labelId="role-select-label"
          id="role-select"
          value={selectedRole}
          label="Role Name"
          onChange={event => {
            handleRoleChange(Number(event.target.value));
          }}
        >
          {roleGroups.map(role => (
            <MenuItem key={`${role.id}-${role.name}`} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

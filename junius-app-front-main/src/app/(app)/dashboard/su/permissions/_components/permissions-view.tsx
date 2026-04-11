'use client';

import { useState } from 'react';

import { Stack, Container } from '@mui/system';

import { useDefinitionStore } from 'src/stores/definition-store';

import RoleForm from './permission-form';
import PermissionsHeader from './permissions-header';

export default function PermissionsView() {
  const [roleGroups] = useDefinitionStore(state => [state.roleGroups]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const selectedRoleGroup = roleGroups.find(role => role.id === selectedRoleId);

  return (
    <Container>
      <Stack direction="column" spacing={3}>
        <PermissionsHeader onRoleChange={setSelectedRoleId} />

        {selectedRoleGroup && <RoleForm roleGroup={selectedRoleGroup} />}
      </Stack>
    </Container>
  );
}

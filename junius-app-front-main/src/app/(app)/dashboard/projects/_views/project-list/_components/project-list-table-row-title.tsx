import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Stack } from '@mui/material';

import { useAuthStore } from 'src/stores/auth-store';
import { getStaffRole } from 'src/services/project-staff';

export default function ProjectListTableRowTitle({
  projectId,
}: {
  projectId: number;
}) {
  const [user] = useAuthStore(state => [state.user]);
  const { data } = useQuery({
    queryKey: ['projects-list', projectId, user],
    queryFn: () => (user ? getStaffRole(projectId, user.id) : null),
  });
  return <Stack>{data ?? 'N/A'}</Stack>;
}

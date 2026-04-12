'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  Stack,
  Avatar,
  Divider,
  Skeleton,
  Typography,
  CardHeader,
  CardContent,
} from '@mui/material';

import { getProjectStaff } from 'src/services/project-staff';
import { useProjectStore } from 'src/stores/project-list-store';
import type { IProjectStaff } from 'src/types/project-staff';

// ----------------------------------------------------------------------

function StaffMember({ member }: { member: IProjectStaff }) {
  const fullName =
    member.user_first_name || member.user_last_name
      ? `${member.user_first_name ?? ''} ${member.user_last_name ?? ''}`.trim()
      : `User #${member.user_id}`;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        src={member.user_profile_picture}
        alt={fullName}
        sx={{ width: 40, height: 40 }}
      >
        {fullName.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {fullName}
        </Typography>
        {member.staff_role_name && (
          <Typography variant="caption" color="text.secondary">
            {member.staff_role_name}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function StaffGroup({
  roleName,
  members,
}: {
  roleName: string;
  members: IProjectStaff[];
}) {
  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1, display: 'block' }}
      >
        {roleName}
      </Typography>
      <Stack spacing={1.5}>
        {members.map(member => (
          <StaffMember key={member.id} member={member} />
        ))}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function ProjectTeam() {
  const [project] = useProjectStore(state => [state.project]);

  const {
    data: staffList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['project-staff', project?.id],
    queryFn: () => getProjectStaff(project!.id),
    enabled: !!project?.id,
  });

  const groupedByRole = useMemo(() => {
    if (!staffList) return {};
    return staffList.reduce<Record<string, IProjectStaff[]>>((acc, member) => {
      const role = member.staff_role_name ?? 'Unassigned';
      if (!acc[role]) acc[role] = [];
      acc[role].push(member);
      return acc;
    }, {});
  }, [staffList]);

  const roleEntries = Object.entries(groupedByRole);

  return (
    <Card>
      <CardHeader title="Project Team" />
      <Divider />
      <CardContent>
        {isLoading && (
          <Stack spacing={2}>
            {[1, 2, 3].map(i => (
              <Stack key={i} direction="row" alignItems="center" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={80} height={12} sx={{ mt: 0.5 }} />
                </Box>
              </Stack>
            ))}
          </Stack>
        )}

        {isError && (
          <Typography variant="body2" color="error">
            Team members could not be loaded.
          </Typography>
        )}

        {!isLoading && !isError && roleEntries.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No team members assigned yet.
          </Typography>
        )}

        {!isLoading && !isError && roleEntries.length > 0 && (
          <Stack
            spacing={3}
            divider={<Divider flexItem />}
          >
            {roleEntries.map(([role, members]) => (
              <StaffGroup key={role} roleName={role} members={members} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

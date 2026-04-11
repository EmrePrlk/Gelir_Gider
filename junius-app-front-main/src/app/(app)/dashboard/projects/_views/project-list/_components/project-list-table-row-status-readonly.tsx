import { Box } from '@mui/material';

import { type ProjectStatus } from 'src/definitions/project-status';

export interface ProjectListTableRowStatusReadonlyProps {
  currentStatus: ProjectStatus;
}

export default function ProjectListTableRowStatusReadonly(
  props: ProjectListTableRowStatusReadonlyProps,
) {
  return (
    <Box display="flex" alignItems="center">
      <Box
        width={12}
        height={12}
        borderRadius="50%"
        bgcolor={getProjectStatusColor(props.currentStatus)}
        mr={1}
      />
      {props.currentStatus}
    </Box>
  );
}

const getProjectStatusColor = (status: ProjectStatus): string => {
  const statusColors: Record<ProjectStatus, string> = {
    Development: 'blue',
    Stage: 'orange',
    Production: 'green',
    Test: 'red',
    Planning: 'purple',
    Draft: 'grey',
  };

  return statusColors[status] || 'grey';
};

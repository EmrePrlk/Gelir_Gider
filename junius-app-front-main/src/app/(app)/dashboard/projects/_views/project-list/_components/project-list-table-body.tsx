import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TableBody } from '@mui/material';

import { useAuthStore } from 'src/stores/auth-store';
import { getProjectsWithInterested } from 'src/services/projects';
import { useProjectListStore } from 'src/stores/project-list-store';

import { TableNoData, TableSkeleton } from 'src/components/table';

import ProjectListTableRow from './project-list-table-row';

interface ProjectListTableBodyProps {
  compactMode?: boolean;
}

function ProjectListTableData({ compactMode }: ProjectListTableBodyProps) {
  const [filters, page, limit, setPagination] = useProjectListStore(state => [
    state.filters,
    state.page,
    state.limit,
    state.setPagination,
  ]);

  const [user] = useAuthStore(state => [state.user]);

  const {
    data: projects,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['projects-list', { page, ...filters }],
    queryFn: () =>
      getProjectsWithInterested(
        {
          page,
          limit,
          ...filters,
        },
        user?.id!,
      ),
  });

  useEffect(() => {
    if (isSuccess) {
      setPagination(projects);
    }
  }, [isSuccess, setPagination, projects]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!projects?.results.length || error) {
    return <TableNoData notFound />;
  }

  return (
    <>
      {projects.results.map(row => (
        <ProjectListTableRow key={row.id} row={row} compactMode={compactMode} />
      ))}
    </>
  );
}

export default function ProjectListTableBody({
  compactMode = false,
}: ProjectListTableBodyProps) {
  return (
    <TableBody>
      <ProjectListTableData compactMode={compactMode} />
    </TableBody>
  );
}

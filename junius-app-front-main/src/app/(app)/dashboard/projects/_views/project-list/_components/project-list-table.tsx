import { useEffect } from 'react';

import { Table, TableContainer } from '@mui/material';

import { useProjectListStore } from 'src/stores/project-list-store';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import ProjectListTableBody from './project-list-table-body';
import ProjectListTableFilters from './project-list-table-filters';
import ProjectListTablePagination from './project-list-table-pagination';

const TABLE_HEAD = [
  { id: 'project', label: 'Project' },
  { id: 'progress', label: 'Progress', width: 100 },
  {
    id: 'teamLeader',
    label: 'Team Leader ',
    width: 150,
  },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'interested', label: 'Interested', width: 50 },
  { id: 'title', label: 'Title', width: 100 },
  { id: 'actions', label: 'Actions', width: 50 },
];

interface ProjectListTableProps {
  compactMode?: boolean;
}

export default function ProjectListTable({
  compactMode = false,
}: ProjectListTableProps) {
  const setFilters = useProjectListStore(state => state.setFilters);

  useEffect(() => {
    if (!compactMode) {
      setFilters({ status: undefined });
    }
  }, [compactMode, setFilters]);

  const displayedHeaders = compactMode
    ? TABLE_HEAD.filter(header => header.id === 'title')
    : TABLE_HEAD;

  return (
    <>
      {!compactMode && <ProjectListTableFilters />}
      <TableContainer
        sx={{
          position: 'relative',
          overflow: 'unset',
          minWidth: compactMode ? 300 : 'auto',
        }}
      >
        <Scrollbar>
          <Table sx={{ minWidth: compactMode ? 300 : 960 }}>
            <TableHeadCustom headLabel={displayedHeaders} />
            <ProjectListTableBody compactMode={compactMode} />
          </Table>
        </Scrollbar>
      </TableContainer>
      {!compactMode && <ProjectListTablePagination />}
    </>
  );
}

import { Table, TableContainer } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import UserListTableBody from './user-list-table-body';
import UserListTableHeader from './user-list-table-header';
import UserListTableFilters from './user-list-table-filters';
import UserListTablePagination from './user-list-table-pagination';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email', width: 180 },
  { id: 'location', label: 'Location', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'actions', label: 'Actions', width: 88 },
];

export default function UserListTable() {
  return (
    <>
      <UserListTableHeader />
      <UserListTableFilters />
      <TableContainer
        sx={{
          position: 'relative',
          overflow: 'unset',
        }}
      >
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <UserListTableBody />
          </Table>
        </Scrollbar>
      </TableContainer>
      <UserListTablePagination />
    </>
  );
}

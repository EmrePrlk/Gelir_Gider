import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TableBody } from '@mui/material';

import { getUsers } from 'src/services/user';
import { useUserListStore } from 'src/stores/user-list-store';

import { TableNoData, TableSkeleton } from 'src/components/table';

import UserTableRow from './user-list-table-row';

function UserListTableData() {
  const [filters, page, limit, setPagination] = useUserListStore(state => [
    state.filters,
    state.page,
    state.limit,
    state.setPagination,
  ]);

  const {
    data: users,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['management-users-list', { page, ...filters }],
    queryFn: () => getUsers({ page, limit, ...filters }),
  });

  useEffect(() => {
    if (isSuccess) {
      setPagination(users);
    }
  }, [isSuccess, setPagination, users]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!users?.results.length || error) {
    return <TableNoData notFound />;
  }

  return (
    <>
      {users.results.map(row => (
        <UserTableRow key={row.id} row={row} />
      ))}
    </>
  );
}

export default function UserListTableBody() {
  return (
    <TableBody>
      <UserListTableData />
    </TableBody>
  );
}

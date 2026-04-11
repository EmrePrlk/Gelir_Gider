import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import TableSkeleton from 'src/components/table/table-skeleton';

import { type IUser } from 'src/types/user';

import UserListTableRowRole from './user-list-table-row-role';
import UserListTableRowStatus from './user-list-table-row-status';
import { UserListTableRowActions } from './user-list-table-row-actions';

// ----------------------------------------------------------------------

type Props = {
  row: IUser;
};

const NA = 'N/A';

export default function UserTableRow({ row }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={`${row.first_name} ${row.last_name}`}
          src={
            typeof row.profile_picture === 'string'
              ? row.profile_picture
              : undefined
          }
          sx={{ mr: 2 }}
        />
        <ListItemText
          primary={`${row.first_name} ${row.last_name}`}
          primaryTypographyProps={{ typography: 'body2' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email || NA}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.country || NA} / {row.city || NA}
      </TableCell>

      <UserListTableRowRole
        userId={row.id}
        currentRoleGroup={row.type_of_user}
        setLoading={setIsLoading}
      />

      <UserListTableRowStatus
        userId={row.id}
        currentStatus={row.status}
        setLoading={setIsLoading}
      />
      <UserListTableRowActions userId={row.id} />
    </TableRow>
  );
}

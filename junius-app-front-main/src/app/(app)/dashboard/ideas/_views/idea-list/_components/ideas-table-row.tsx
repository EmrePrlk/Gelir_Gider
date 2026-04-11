'use client';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDateTime } from 'src/utils/format-time';

import { Status } from 'src/definitions/statuses';

import Iconify from 'src/components/iconify';
import Label, { type LabelColor } from 'src/components/label';

import { type IIdea } from 'src/types/idea';

// ----------------------------------------------------------------------

type Props = {
  row: IIdea;
  onClick: () => void;
  compactMode?: boolean;
};

export default function IdeasTableRow({ row, onClick, compactMode }: Props) {
  const { name, color } = parseStatus(row.status as Status);

  if (compactMode) {
    return (
      <TableRow hover onClick={onClick} sx={{ cursor: 'pointer' }}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title}</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover onClick={onClick} sx={{ cursor: 'pointer' }}>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.title}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {fDateTime(row.entry_date)}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.category}</TableCell>
      <TableCell>
        <Label color={color}>{name}</Label>
      </TableCell>
      <TableCell>
        <Iconify
          onClick={onClick}
          icon="mdi:chevron-right"
          width={24}
          height={24}
        />
      </TableCell>
    </TableRow>
  );
}

function parseStatus(status: Status): { name: string; color: LabelColor } {
  switch (status) {
    case Status.ACTIVE: {
      return { name: 'Active', color: 'success' };
    }
    case Status.REJECTED: {
      return { name: 'Rejected', color: 'error' };
    }
    case Status.PENDING: {
      return { name: 'Pending Review', color: 'warning' };
    }
    case Status.INACTIVE: {
      return { name: 'Inactive', color: 'default' };
    }
    default: {
      return { name: 'N/A', color: 'default' };
    }
  }
}

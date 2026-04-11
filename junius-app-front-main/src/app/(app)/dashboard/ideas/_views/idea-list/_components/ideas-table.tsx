import { Table, TableContainer } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import IdeasTableBody from './ideas-table-body';
import IdeasTablePagination from './ideas-table-pagination';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', width: 180 },
  { id: 'entry_date', label: 'Entry Date', width: 220 },
  { id: 'category', label: 'Category', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
];

interface IdeasTableProps {
  compactMode?: boolean;
}

export default function IdeasTable({ compactMode = false }: IdeasTableProps) {
  const displayedHeaders = compactMode
    ? TABLE_HEAD.filter(header => header.id === 'title')
    : TABLE_HEAD;

  return (
    <>
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
            <IdeasTableBody compactMode={compactMode} />
          </Table>
        </Scrollbar>
      </TableContainer>
      {!compactMode && <IdeasTablePagination />}
    </>
  );
}

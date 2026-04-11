'use client';
import { Card, Table, Container, TableContainer } from '@mui/material';

import WelcomeBar from 'src/app/(app)/_components/welcome-bar';
import { MotivationIllustration } from 'src/assets/illustrations';
import IdeaBreadcrumbs from 'src/app/(app)/dashboard/ideas/_components/idea-breadcrumbs';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import IdeasTableBody from './_components/ideas-table-body';
import IdeasTablePagination from './_components/ideas-table-pagination';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', width: 180 },
  { id: 'entry_date', label: 'Entry Date', width: 220 },
  { id: 'category', label: 'Category', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'arrow', label: '', width: 10 },
];

export default function IdeasTableView() {
  return (
    <Container>
      <WelcomeBar
        title="This is the ideas list"
        description="You can manage ideas here, change their statuses, etc. You can also add new ideas, delete them and approve the new ones."
      >
        <MotivationIllustration />
      </WelcomeBar>
      <IdeaBreadcrumbs />
      <Card>
        <TableContainer>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <IdeasTableBody />
            </Table>
          </Scrollbar>
        </TableContainer>
        <IdeasTablePagination />
      </Card>
    </Container>
  );
}

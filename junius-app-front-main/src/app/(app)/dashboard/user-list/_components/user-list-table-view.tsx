'use client';
import { Card, Container } from '@mui/material';

import { SeoIllustration } from 'src/assets/illustrations';
import WelcomeBar from 'src/app/(app)/_components/welcome-bar';

import UserListTable from './user-list-table';
import UserListPageHeader from './user-list-page-header';

export default function UserListTableView() {
  return (
    <Container>
      <WelcomeBar
        title="This is the user list"
        description="You can manage users here, change their roles, statuses, etc. You can also add new users, delete them and approve the new ones."
      >
        <SeoIllustration />
      </WelcomeBar>
      <UserListPageHeader />
      <Card>
        <UserListTable />
      </Card>
    </Container>
  );
}

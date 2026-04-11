'use client';
import { Card, Container } from '@mui/material';

import WelcomeBar from 'src/app/(app)/_components/welcome-bar';
import { SeverErrorIllustration } from 'src/assets/illustrations';
import ProjectBreadcrumbs from 'src/app/(app)/dashboard/projects/_components/project-breadcrumbs';

import ProjectListTable from './_components/project-list-table';

export default function ProjectListTableView() {
  return (
    <Container>
      <WelcomeBar
        title="This is the project list"
        description="You can manage projects here, change their statuses, etc. You can also add new projects, delete them and approve the new ones."
        closeable
      >
        <SeverErrorIllustration />
      </WelcomeBar>
      <ProjectBreadcrumbs />
      <Card>
        <ProjectListTable />
      </Card>
    </Container>
  );
}

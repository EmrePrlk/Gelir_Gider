'use client';

import { Grid, Stack, Container, Typography } from '@mui/material';

import { useAuthStore } from 'src/stores/auth-store';
import WelcomeBar from 'src/app/(app)/_components/welcome-bar';
import { ProjectStatus } from 'src/definitions/project-status';
import { MotivationIllustration } from 'src/assets/illustrations';
import { useProjectListStore } from 'src/stores/project-list-store';
import IdeasTable from 'src/app/(app)/dashboard/ideas/_views/idea-list/_components/ideas-table';
import ProjectListTable from 'src/app/(app)/dashboard/projects/_views/project-list/_components/project-list-table';

export default function DashboardView() {
  const [user] = useAuthStore(state => [state.user]);
  const setFilters = useProjectListStore(state => state.setFilters);

  setFilters({ status: ProjectStatus.Planning });

  return (
    <Container maxWidth={false}>
      <WelcomeBar
        title={`Welcome to the Junius App, ${user?.first_name}!`}
        description="Here you can manage your ideas, projects, investments, etc."
      >
        <MotivationIllustration />
      </WelcomeBar>

      <Grid
        container
        spacing={4}
        sx={{
          mt: 5,
          px: 2,
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            boxShadow: 2,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Your Projects</Typography>
            <ProjectListTable compactMode />
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            boxShadow: 2,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6">Your Ideas</Typography>
            <IdeasTable compactMode />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

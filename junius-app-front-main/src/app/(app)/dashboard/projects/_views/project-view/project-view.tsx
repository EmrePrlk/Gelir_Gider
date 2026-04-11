'use client';

import { Container } from '@mui/material';

import { useProjectStore } from 'src/stores/project-list-store';
import ProjectBreadcrumbs from 'src/app/(app)/dashboard/projects/_components/project-breadcrumbs';

import ProjectBody from './_components/project-body';
import ProjectCover from './_components/project-cover';

export default function ProjectView() {
  const [project] = useProjectStore(state => [state.project]);

  if (!project) return null;

  return (
    <Container>
      <ProjectBreadcrumbs title={project.title} />
      <ProjectCover />
      <ProjectBody />
    </Container>
  );
}

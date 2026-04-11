'use client';

import { Stack, Container } from '@mui/material';

import { AlertError } from 'src/components/form-error';
import FormProvider from 'src/components/hook-form/form-provider';

import ProjectForm from './_components/project-form';
import { useProjectForm } from './_hooks/use-project-form';
import ProjectBreadcrumbs from '../../_components/project-breadcrumbs';

export default function ProjectEditView() {
  const { methods, onSubmit, errorMsg, submitting } = useProjectForm();

  return (
    <Container>
      <ProjectBreadcrumbs title="Edit Project" />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <AlertError error={errorMsg} />
          <ProjectForm submitting={submitting} />
        </Stack>
      </FormProvider>
    </Container>
  );
}

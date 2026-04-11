import React from 'react';

import { Stack, Typography } from '@mui/material';

import UploadFile from 'src/app/(app)/_components/upload-file';

import { RHFTextField } from 'src/components/hook-form';

import LandingBaseForm from '../../_components/landing-base-form';

export default function IdeatorForm({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <LandingBaseForm isSubmitting={isSubmitting}>
      <Typography variant="h6" mt={2}>
        About Your Project
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="title_project" label="Project Title" />
        <RHFTextField name="competitors_project" label="Competitors" />
      </Stack>
      <RHFTextField name="description_project" label="Project Description" />
      <UploadFile
        name="documents_project"
        label="Upload Your Project Documents"
        isSubmitting={isSubmitting}
        maxCount={5}
        multiple
        helperText="Allowed *.pdf, *.docx, *.pptx, *.xlsx, *.xls"
        accept={{
          'application/pdf': ['.pdf'],
          'application/msword': ['.docx'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            ['.pptx'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.xlsx',
          ],
        }}
      />
    </LandingBaseForm>
  );
}

import React from 'react';

import { Box, Stack, MenuItem, Typography } from '@mui/material';

import UploadFile from 'src/app/(app)/_components/upload-file';
import { useDefinitionStore } from 'src/stores/definition-store';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

import LandingBaseForm from '../../_components/landing-base-form';

export default function DeveloperForm({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const [preferedTitles] = useDefinitionStore(state => [state.preferedTitles]);

  return (
    <LandingBaseForm isSubmitting={isSubmitting}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFSelect name="prefered_title" label="Title">
          {preferedTitles.map(title => (
            <MenuItem key={title.id} value={title.id}>
              {title.title}
            </MenuItem>
          ))}
        </RHFSelect>
        <Box sx={{ width: '100%' }} />
      </Stack>
      <Typography variant="h6" mt={2}>
        Social Links
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="linkedin_link" label="Linkedin Url" />
        <RHFTextField name="github_link" label="Github Url" />
      </Stack>

      <UploadFile
        name="cv_link"
        label="Upload Your Resume"
        isSubmitting={isSubmitting}
        helperText="Allowed *.pdf"
        accept={{ 'application/pdf': ['.pdf'] }}
      />
    </LandingBaseForm>
  );
}

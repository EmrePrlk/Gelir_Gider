'use client';

import { LoadingButton } from '@mui/lab';
import { Stack, MenuItem } from '@mui/material';

import { Industry } from 'src/definitions';
import { ProjectStatus } from 'src/definitions/project-status';

import Iconify from 'src/components/iconify';
import { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';

import ProjectFormSection from './project-form-section';

export default function ProjectForm({ submitting }: { submitting: boolean }) {
  return (
    <Stack spacing={6}>
      {/* Project Title */}
      <ProjectFormSection title="Project Title">
        <RHFTextField name="title" />
      </ProjectFormSection>
      {/* Project Status */}
      <ProjectFormSection title="Project Status">
        <RHFSelect name="status">
          {Object.keys(ProjectStatus).map(key => (
            <MenuItem key={key} value={key}>
              <Stack direction="row" alignItems="center">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: getProjectStatusColor(
                      key as ProjectStatus,
                    ),
                    marginRight: 8,
                  }}
                />
                {key}
              </Stack>
            </MenuItem>
          ))}
        </RHFSelect>
      </ProjectFormSection>
      {/* Project Industry */}
      <ProjectFormSection title="Project Industry">
        <RHFSelect name="category" label="Category">
          {Object.entries(Industry).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </RHFSelect>
      </ProjectFormSection>
      {/* Project Target Investment */}
      <ProjectFormSection title="Project Target Investment">
        <RHFTextField
          name="target_investment"
          type="number"
          InputProps={{
            startAdornment: <Iconify icon="mdi:currency-usd" sx={{ mr: 1 }} />,
          }}
        />
      </ProjectFormSection>

      {/* Project Description */}
      <ProjectFormSection title="Project Description">
        <RHFEditor name="detail" />
      </ProjectFormSection>
      <Stack direction="row" justifyContent="flex-end">
        <LoadingButton
          type="submit"
          variant="contained"
          loading={submitting}
          startIcon={<Iconify icon="mdi:rocket-launch" />}
          sx={{ p: 2 }}
        >
          Update Project
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
const getProjectStatusColor = (status: ProjectStatus): string => {
  const statusColors: Record<ProjectStatus, string> = {
    Development: 'blue',
    Stage: 'orange',
    Production: 'green',
    Test: 'red',
    Planning: 'purple',
    Draft: 'grey',
  };

  return statusColors[status] || 'grey';
};

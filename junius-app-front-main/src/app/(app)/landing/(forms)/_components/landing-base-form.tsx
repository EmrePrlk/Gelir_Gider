'use client';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Paper, MenuItem, Typography } from '@mui/material';

import { countries } from 'src/assets/data/countries';
import { useDefinitionStore } from 'src/stores/definition-store';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function LandingBaseForm({
  children,
  isSubmitting,
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
}) {
  const [educationLevels, preferedTitleExperiences] = useDefinitionStore(
    state => [state.educationLevels, state.preferedTitleExperiences],
  );

  return (
    <Paper
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        marginX: '1rem',
        boxShadow: '0px 0px 2px 0px #919EAB33',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="h6">Personal Information</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="first_name" label="First Name" />
          <RHFTextField name="last_name" label="Last Name" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="email" label="Email Address" />
          <RHFTextField name="phone_number" label="Phone Number" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="country" label="Country">
            {countries.map(country => (
              <MenuItem key={country.code} value={country.label}>
                {country.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField name="state_region" label="State/Region" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="city" label="City" />
          <RHFTextField name="zip_code" label="Zip/Code" />
        </Stack>
        <RHFTextField name="address" label="Address" />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mt: 2 }}
          spacing={2}
        >
          <RHFSelect name="education_level" label="Education">
            <MenuItem value="-1" disabled>
              Select Education Level
            </MenuItem>
            {educationLevels.map(level => (
              <MenuItem key={level.value} value={level.id}>
                {level.title}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect name="prefered_title_experience" label="Experience">
            <MenuItem value="" disabled>
              Select Experience Level
            </MenuItem>
            {preferedTitleExperiences.map(exp => (
              <MenuItem key={exp.value} value={exp.id}>
                {exp.title}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        {children}
        <Stack display="flex" alignItems={{ xs: 'center', md: 'flex-end' }}>
          <LoadingButton
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Continue
          </LoadingButton>
        </Stack>
      </Stack>
    </Paper>
  );
}

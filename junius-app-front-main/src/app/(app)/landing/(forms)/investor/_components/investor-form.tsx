import React from 'react';

import { Box, Stack, MenuItem, Typography } from '@mui/material';

import { Industry, InvestmentAmount } from 'src/definitions';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

import LandingBaseForm from '../../_components/landing-base-form';

export default function InvestorForm({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <LandingBaseForm isSubmitting={isSubmitting}>
      <Typography variant="h6" mt={2}>
        Investment Plan
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFSelect name="investment_amount" label="Investment Amount">
          {Object.values(InvestmentAmount).map(amount => (
            <MenuItem key={amount} value={amount}>
              {amount}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="interested_areas" label="Interested Areas">
          {Object.values(Industry).map(industry => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="linkedin_link" label="LinkedIn URL" />
        <Box sx={{ width: '100%' }} />
      </Stack>
      <RHFTextField name="about_me" label="Tell us a bit about yourself" />
    </LandingBaseForm>
  );
}

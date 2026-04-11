'use client';

import { Grid, Container } from '@mui/material';

import FormProvider from 'src/components/hook-form';
import { AlertError } from 'src/components/form-error';

import useLandingItem from '../_hooks/use-landing-item';
import type useLandingBaseForm from '../_hooks/use-landing-base-form';

export default function LandingBaseFormView({
  children,
  methods,
  onSubmit,
  errorMsg,
}: {
  children: React.ReactNode;
  methods: ReturnType<typeof useLandingBaseForm>['methods'];
  onSubmit: ReturnType<typeof useLandingBaseForm>['onSubmit'];
  errorMsg: string;
}) {
  const landingItem = useLandingItem();

  const IconComponent = landingItem?.icon;

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container>
          <Grid
            item
            md={3}
            display={{ xs: 'none', md: 'flex' }}
            sx={{ justifyContent: 'center' }}
          >
            {IconComponent && (
              <IconComponent sx={{ width: '100%', height: '200px' }} />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            <AlertError error={errorMsg} />

            {children}
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

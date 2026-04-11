'use client';

import { Stack, useTheme, Container, Typography } from '@mui/material';

import LandingBackButton from './landing-back-button';
import useLandingItem from '../../_hooks/use-landing-item';

export default function LandingHeader() {
  const theme = useTheme();
  const landingItem = useLandingItem();
  const title = landingItem?.name;

  return (
    <Container sx={{ marginBottom: { xs: '24px', md: '48px' } }}>
      <Stack direction="row" alignItems="center">
        <LandingBackButton />
        <Stack
          sx={{
            marginLeft: theme.spacing(3),
            maxWidth: theme.breakpoints.values.md,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="body1">Let Us Know Each Other</Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

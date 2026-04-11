import RouterLink from 'next/link';

import { Link, Stack, Typography } from '@mui/material';

import { paths } from 'src/config/paths';

export default function RegisterHead() {
  return (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative', mt: 10 }}>
      <Typography variant="h4">Registration</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Already have an account?</Typography>

        <Link
          href={paths.auth.login}
          component={RouterLink}
          variant="subtitle2"
        >
          Sign in
        </Link>
      </Stack>
    </Stack>
  );
}

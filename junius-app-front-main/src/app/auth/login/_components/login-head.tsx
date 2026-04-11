import RouterLink from 'next/link';

import { Link, Stack, Typography } from '@mui/material';

import { paths } from 'src/config/paths';

export default function LoginHead() {
  return (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Login</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Already have not an account?</Typography>

        <Link
          component={RouterLink}
          href={paths.auth.register}
          variant="subtitle2"
        >
          Create an account
        </Link>
      </Stack>
    </Stack>
  );
}

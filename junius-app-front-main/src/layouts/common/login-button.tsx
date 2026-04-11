import RouterLink from 'next/link';

import Button from '@mui/material/Button';
import { type Theme, type SxProps } from '@mui/material/styles';

import { paths } from 'src/config/paths';

// ----------------------------------------------------------------------

type Props = {
  sx?: SxProps<Theme>;
};

export default function LoginButton({ sx }: Props) {
  return (
    <Button
      component={RouterLink}
      href={paths.auth.login}
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      Login
    </Button>
  );
}

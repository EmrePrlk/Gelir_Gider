import { Link, Typography } from '@mui/material';

export default function RegisterTerms() {
  return (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary" href="/">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary" href="/">
        Privacy Policy
      </Link>
      .
    </Typography>
  );
}

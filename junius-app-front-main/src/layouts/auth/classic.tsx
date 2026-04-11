import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, title }: Props) {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
        ml: { xs: '40%' },
        width: { xs: 100, md: 50 },
        height: { xs: 100, md: 50 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 10 },
        pb: { xs: 10, md: 10 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94,
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Stack
        sx={{
          width: 'fit-content',
          maxWidth: 480,
          marginBottom: '37%',
          marginLeft: 14,
          textAlign: 'start',
          gap: theme.spacing(2),
        }}
      >
        <Logo wide sx={{ width: 1080 / 4, height: 700 / 4 }} />
        <Typography variant="h3">{title || 'Welcome to JuniusAPP'}</Typography>
        <Typography variant="body2">
          Already have not an account?{' '}
          <Link sx={{ cursor: 'pointer' }} href="/">
            Registration
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}

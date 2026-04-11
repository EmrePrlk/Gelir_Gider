import {
  Stack,
  alpha,
  useTheme,
  Typography,
  IconButton,
  type StackProps,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  closeable?: boolean;
  textMaxWidth?: number;
};

export default function WelcomeBar({
  title,
  description,
  action,
  closeable = false,
  textMaxWidth,
  children,
  ...other
}: Props) {
  const { value: isVisible, onFalse: hideWelcomeBar } = useBoolean(true);
  const theme = useTheme();

  if (!isVisible) {
    return null;
  }

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        // Remove the height property
        // height: { md: 1 },
        minHeight: { xs: 'auto', md: 200 }, // Add a minimum height
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
        mb: 5,
      }}
      {...other}
    >
      {closeable && (
        <IconButton
          onClick={hideWelcomeBar}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'primary.darker',
          }}
        >
          <Iconify icon="mdi:close" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: textMaxWidth ?? 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Stack>

      {children && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 360,
            mx: 'auto',
          }}
        >
          {children}
        </Stack>
      )}
    </Stack>
  );
}

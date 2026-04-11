import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import AccountEdit from './account-edit';
import { useManagedUser } from '../../../_context/use-managed-user';

// ----------------------------------------------------------------------

export default function AccountCover() {
  const theme = useTheme();
  const { user } = useManagedUser();

  if (!user) return null;

  return (
    <>
      <AccountEdit />

      <Card sx={{ position: 'relative', mb: 3, height: 290 }}>
        <Box
          sx={{
            ...bgGradient({
              color: alpha(theme.palette.primary.darker, 0.8),
              imgUrl: '/assets/cover.png',
            }),
            height: 1,
            color: 'common.white',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              left: { md: 24 },
              bottom: { md: 24 },
              zIndex: { md: 10 },
              pt: { xs: 6, md: 0 },
              position: { md: 'absolute' },
            }}
          >
            <Avatar
              alt={`${user.first_name} ${user.last_name}`}
              src={(user.profile_picture as string) ?? ''}
              sx={{
                mx: 'auto',
                width: { xs: 64, md: 128 },
                height: { xs: 64, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            >
              {user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              sx={{
                mt: 3,
                ml: { md: 3 },
                textAlign: { xs: 'center', md: 'unset' },
              }}
              primary={`${user.first_name} ${user.last_name}`}
              secondary={user.title}
              primaryTypographyProps={{
                typography: 'h4',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: 'inherit',
                component: 'span',
                typography: 'body2',
                sx: { opacity: 0.48 },
              }}
            />
          </Stack>
        </Box>
      </Card>
    </>
  );
}

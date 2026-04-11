'use client';
import {
  Box,
  Grid,
  Card,
  alpha,
  Stack,
  Avatar,
  useTheme,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { bgGradient } from 'src/theme/css';
import { useProjectStore } from 'src/stores/project-list-store';

export default function ProjectCover() {
  const theme = useTheme();
  const [project] = useProjectStore(state => [state.project]);

  if (!project) return null;

  return (
    <Grid container spacing={2} alignItems="center" mb={3}>
      <Grid
        item
        xs={12}
        sm="auto"
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <Box sx={{ position: 'relative', width: 150, height: 150 }}>
          {/* TODO: Connect project progress to the backend */}
          <CircularProgress
            size={150}
            thickness={2}
            variant="determinate"
            value={83}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
              color: theme.palette.success.main,
            }}
          />
          {/* TODO: Connect project avatar to the backend */}
          <Avatar
            src="/assets/images/idea_avatar.png"
            sx={{
              width: 130,
              height: 130,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm>
        <Card>
          <Stack
            sx={{
              ...bgGradient({
                color: alpha(theme.palette.primary.darker, 0.8),
                imgUrl: '/assets/cover.png',
              }),
              color: 'common.white',
              height: { xs: 150, sm: 173 },
              justifyContent: {
                xs: 'center',
                md: 'flex-end',
              },
            }}
          >
            <Box sx={{ padding: 3 }}>
              <ListItemText
                sx={{
                  textAlign: { xs: 'center', md: 'unset' },
                }}
                primary={project?.title}
                secondary="Junius App"
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
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

import {
  Box,
  Card,
  Stack,
  useTheme,
  Typography,
  CardHeader,
  CardContent,
  LinearProgress,
} from '@mui/material';

import { useProjectStore } from 'src/stores/project-list-store';

function ProjectTargetInvestment() {
  const theme = useTheme();

  const [project] = useProjectStore(state => [state.project]);

  const targetInvestment = project?.idea?.target_investment ?? 1;
  const currentInvestment = Math.round(targetInvestment * 0.33);
  const percentage = Math.round((currentInvestment / targetInvestment) * 100);

  return (
    <Card>
      <CardHeader title="Project Target Investment" />
      <CardContent>
        <Typography variant="body2" gutterBottom sx={{ pl: 1 }}>
          Current Investment Amount:
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box position="relative" width="100%">
            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 29,
                borderRadius: 10,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.success.main,
                },
              }}
            />
            <Stack
              direction="row"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 10,
                pointerEvents: 'none',
                px: 2,
              }}
            >
              {/* Current Investment Amount */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500 }}
                color={
                  percentage < 30
                    ? theme.palette.secondary.contrastText
                    : theme.palette.success.contrastText
                }
              >
                {`${currentInvestment.toLocaleString()}$ (${percentage}%)`}
              </Typography>
            </Stack>
          </Box>
          <Typography variant="body2" textAlign="right" fontWeight={600}>
            {targetInvestment.toLocaleString()}$
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProjectTargetInvestment;

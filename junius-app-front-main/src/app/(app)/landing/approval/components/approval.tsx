'use client';

import {
  Box,
  Step,
  Link,
  Stack,
  Button,
  Stepper,
  StepLabel,
  Typography,
} from '@mui/material';

import { Status } from 'src/definitions/statuses';
import { useAuthStore } from 'src/stores/auth-store';

import StepIcon from './step-icon';
import { getStatusInfo } from './utils';
import StepConnector from './step-connector';

function ApprovalView() {
  const { user } = useAuthStore();
  const status = user?.status || Status.PENDING;
  const statusInfo = getStatusInfo(status);

  return (
    <Stack
      sx={{
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        height: 'calc(100vh - 12rem)',
      }}
      spacing={4}
    >
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {statusInfo.text}
        </Typography>
      </Box>

      <Stepper
        alternativeLabel
        activeStep={statusInfo.activeStep}
        connector={<StepConnector status={status} />}
      >
        {statusInfo.stepsLabel.map(label => (
          <Step key={label} sx={{ padding: '0' }}>
            <StepLabel
              // eslint-disable-next-line react/no-unstable-nested-components
              StepIconComponent={props => (
                <StepIcon {...props} status={status} />
              )}
              sx={{
                '& .MuiStepLabel-label': {
                  maxWidth: '120px',
                  marginX: 'auto',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          marginX: 'auto',
          width: '100%',
          maxWidth: '585px',
          padding: '0 1rem',
        }}
      >
        <Typography variant="body2" sx={{ color: '#919EAB' }}>
          {statusInfo.description}
        </Typography>
      </Box>

      <Link
        href={statusInfo.buttonLink}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0px 16px',
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          size="medium"
          sx={{
            width: { xs: '100%', sm: '197px' },
            height: '36px',
            padding: '0px 16px',
          }}
        >
          <span>{statusInfo.buttonText}</span>
        </Button>
      </Link>
    </Stack>
  );
}

export default ApprovalView;

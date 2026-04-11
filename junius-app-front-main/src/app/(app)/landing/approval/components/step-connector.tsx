/* eslint-disable no-nested-ternary */
import {
  styled,
  stepConnectorClasses,
  StepConnector as MuiStepConnector,
} from '@mui/material';

import { Status } from 'src/definitions/statuses';

export const getStepConnectorStyles = (status: Status) =>
  styled(MuiStepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor:
          status === Status.REJECTED || status === Status.SUSPENDED
            ? '#B71D18'
            : status === Status.INACTIVE
              ? '#637381'
              : '#00A76F',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: '#00A76F',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: status === Status.PENDING ? '#DFE3E8' : '#919EAB33',
      borderRadius: 1,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
  }));

export default function StepConnector({ status }: { status: Status }) {
  const StyledConnector = getStepConnectorStyles(status);
  return <StyledConnector />;
}

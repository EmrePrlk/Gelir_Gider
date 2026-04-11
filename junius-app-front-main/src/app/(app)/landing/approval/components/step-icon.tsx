/* eslint-disable no-nested-ternary */
import { styled } from '@mui/material/styles';
import { type StepIconProps } from '@mui/material/StepIcon';

import { Status } from 'src/definitions/statuses';

import Iconify from 'src/components/iconify';

import { getStepIcon } from './utils';

export default function StepIcon(
  props: Readonly<StepIconProps & { status: Status }>,
) {
  const { active, completed, className, icon, status } = props;

  const stepIndex = Number(icon) - 1;

  const iconName = getStepIcon(status, stepIndex);

  const ColorlibStepIconRoot = getStepIconStyles(status, stepIndex);

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      <Iconify icon={iconName} width={24} />
    </ColorlibStepIconRoot>
  );
}

// Update the step icon styles based on the status and step number
const getStepIconStyles = (status: Status, stepIndex: number) =>
  styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme }) => ({
    backgroundColor:
      stepIndex === 2 &&
      (status === Status.REJECTED || status === Status.SUSPENDED)
        ? '#B71D18'
        : stepIndex === 2 && status === Status.INACTIVE
          ? '#637381'
          : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 48,
    height: 48,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor:
        stepIndex === 2 &&
        (status === Status.REJECTED || status === Status.SUSPENDED)
          ? '#B71D18'
          : stepIndex === 2 && status === Status.INACTIVE
            ? '#637381'
            : theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundColor:
            (status === Status.REJECTED || status === Status.SUSPENDED) &&
            stepIndex === 2
              ? '#B71D18'
              : status === Status.INACTIVE && stepIndex === 2
                ? '#637381'
                : '#00A76F',
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          backgroundColor:
            (status === Status.REJECTED || status === Status.SUSPENDED) &&
            stepIndex === 2
              ? '#B71D18'
              : status === Status.INACTIVE && stepIndex === 2
                ? '#637381'
                : '#00A76F',
        },
      },
    ],
  }));

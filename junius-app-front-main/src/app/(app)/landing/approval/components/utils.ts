import { paths } from 'src/config/paths';
import { Status } from 'src/definitions/statuses';
import { INFO_MAIL, CONTACT_US_PAGE } from 'src/config/constants';

type StatusInfo = {
  text: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  activeStep: number;
  stepsLabel: string[];
};

export function getStatusInfo(status: Status): StatusInfo {
  switch (status) {
    case Status.PENDING: {
      return {
        text: 'Pending Approval',
        description: `You can still edit your profile from here, while your account is under review by our team. Updating and detailing your profile might reduce your review time. ${INFO_MAIL}`,
        buttonText: 'Check Your Profile',
        buttonLink: paths.account.root,
        activeStep: 1,
        stepsLabel: [
          'Your request sent to our team',
          'Your request under review',
          'Pending Review',
        ],
      };
    }
    case Status.ACTIVE: {
      return {
        text: 'Approved',
        description: `Your profile has been reviewed and approved by our team. You can log in to the system and add value to the japp team. ${INFO_MAIL}`,
        buttonText: 'Go to Dashboard',
        buttonLink: paths.dashboard.root,
        activeStep: 2,
        stepsLabel: [
          'Your request sent to our team',
          'Your request under review',
          'Approved',
        ],
      };
    }
    case Status.REJECTED: {
      return {
        text: 'Rejected',
        description: `Your profile has been reviewed by our team and has not been approved. If you think there is an error, you can contact our team. ${INFO_MAIL}`,
        buttonText: 'Contact Support',
        buttonLink: CONTACT_US_PAGE,
        activeStep: 2,
        stepsLabel: [
          'Your request sent to our team',
          'Your request under review',
          'Rejected',
        ],
      };
    }
    case Status.SUSPENDED: {
      return {
        text: 'Account Suspended',
        description: `Your account has been temporarily suspended. Please contact our support team for more information. ${INFO_MAIL}`,
        buttonText: 'Contact Support',
        buttonLink: CONTACT_US_PAGE,
        activeStep: 2,
        stepsLabel: [
          'Your request sent to our team',
          'Your request under review',
          'Suspended',
        ],
      };
    }
    case Status.INACTIVE: {
      return {
        text: 'Account Inactive',
        description: `Your account is currently inactive. Please contact our support team for assistance. ${INFO_MAIL}`,
        buttonText: 'Reactivate Account',
        buttonLink: CONTACT_US_PAGE,
        activeStep: 2,
        stepsLabel: [
          'Your request sent to our team',
          'Your request under review',
          'Inactive',
        ],
      };
    }
    default: {
      return {
        text: '',
        description: '',
        buttonText: '',
        buttonLink: '/',
        activeStep: 0,
        stepsLabel: [],
      };
    }
  }
}

export function getStepIcon(status: Status, stepIndex: number): string {
  if (status === Status.ACTIVE && stepIndex === 2) {
    return 'solar:cup-star-bold';
  }
  if (
    (status === Status.REJECTED || status === Status.SUSPENDED) &&
    stepIndex === 2
  ) {
    return 'solar:close-circle-bold';
  }
  if (status === Status.INACTIVE && stepIndex === 2) {
    return 'solar:user-broken-bold';
  }
  if (
    status === Status.ACTIVE ||
    ((status === Status.REJECTED ||
      status === Status.SUSPENDED ||
      status === Status.INACTIVE) &&
      stepIndex < 2)
  ) {
    return 'solar:verified-check-bold';
  }
  if (status === Status.PENDING && stepIndex === 0) {
    return 'solar:inbox-bold';
  }
  return 'solar:clock-circle-outline';
}

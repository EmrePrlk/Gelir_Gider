import { type SxProps } from '@mui/system';

import { type IUser } from 'src/types/user';

import InfoCard from './info-card';

type UserContactCardProps = {
  user?: IUser | null;
  sx?: SxProps;
};

export default function UserContactCard({ user, sx }: UserContactCardProps) {
  if (!user) return null;

  const contactInfo = [
    {
      icon: {
        name: 'solar:user-rounded-bold',
      },
      label: 'Name',
      value: user?.first_name && `${user.first_name} ${user.last_name}`,
    },
    {
      icon: {
        name: 'fluent:mail-24-filled',
      },
      label: 'Email',
      value: user?.email,
    },
    {
      icon: {
        name: 'solar:phone-bold',
      },
      label: 'Phone',
      value: user?.phone_number,
    },
    {
      icon: {
        name: 'mingcute:location-fill',
      },
      label: 'Location',
      value: user?.country,
    },
  ].filter(item => item.value);

  if (contactInfo.every(item => !item.value)) return null;

  return <InfoCard title="Contact" data={contactInfo} sx={sx} />;
}

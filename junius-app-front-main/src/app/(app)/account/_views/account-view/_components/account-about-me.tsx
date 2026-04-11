import { Card, CardHeader } from '@mui/material';

import TextMaxLine from 'src/components/text-max-line';

import { useManagedUser } from '../../../_context/use-managed-user';

export default function AccountAboutMe() {
  const { user } = useManagedUser();
  if (!user?.about_me) return null;
  return (
    <Card>
      <CardHeader
        title="About ME"
        sx={{
          padding: '24px 16px 24px 24px',
          gap: '16px',
        }}
      />
      <TextMaxLine
        variant="caption"
        sx={{
          fontWeight: 'fontWeightSemiBold',
          padding: '0 24px 24px 24px',
          gap: '16px',
        }}
      >
        {user?.about_me}
      </TextMaxLine>
    </Card>
  );
}

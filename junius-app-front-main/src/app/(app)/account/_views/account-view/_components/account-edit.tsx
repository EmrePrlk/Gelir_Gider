'use client';

import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; // Import the router
import { paths } from 'src/config/paths'; // Import your paths
import Iconify from 'src/components/iconify';

import { useManagedUser } from '../../../_context/use-managed-user';

export default function AccountEdit() {
  const router = useRouter();
  const { user, managed } = useManagedUser();

  const handleEditProfile = () => {
    const route = managed
      ? paths.account.edit(user?.id.toString() ?? '')
      : paths.account.settings;
    router.push(route);
  };

  return (
    <Stack spacing={2} sx={{ p: 3, pr: 0, pt: 0 }}>
      <Button
        variant="contained"
        sx={{ alignSelf: 'flex-end' }}
        onClick={handleEditProfile}
        startIcon={<Iconify icon="mdi:gear" />}
      >
        {managed ? 'Edit User' : 'Account Settings'}
      </Button>
    </Stack>
  );
}

'use client';

import Container from '@mui/material/Container';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import AccountBody from './_components/account-body';
import AccountCover from './_components/account-cover';
import { useManagedUser } from '../../_context/use-managed-user';
import AccountBreadcrumbs from '../../_components/account-breadcrumbs';

// ----------------------------------------------------------------------

export default function AccountView() {
  const { user } = useManagedUser();
  return (
    <Container>
      <SplashWrapper isLoading={!user}>
        <AccountBreadcrumbs />
        <AccountCover />
        <AccountBody />
      </SplashWrapper>
    </Container>
  );
}

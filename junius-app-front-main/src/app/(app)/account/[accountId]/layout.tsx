'use client';
import { useQuery } from '@tanstack/react-query';

import { getUserById } from 'src/services/user';
import { BASE_QUERY_TAG } from 'src/config/constants';
import { withErrorHandling } from 'src/hoc/with-error-handling';

import { ManagedUserProvider } from '../_context/use-managed-user';

function AccountIdLayout({
  params,
  children,
}: {
  params: { accountId: string };
  children: React.ReactNode;
}) {
  const { data } = useQuery({
    queryKey: ['user', params.accountId],
    queryFn: () => getUserById(Number(params.accountId)),
    enabled: !!params.accountId,
    meta: {
      tags: [BASE_QUERY_TAG],
    },
  });

  return (
    <ManagedUserProvider user={data} managed>
      {children}
    </ManagedUserProvider>
  );
}

export default withErrorHandling(AccountIdLayout);

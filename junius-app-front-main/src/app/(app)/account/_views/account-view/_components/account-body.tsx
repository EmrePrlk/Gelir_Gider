'use client';
import { useQueries } from '@tanstack/react-query';

import { Stack } from '@mui/material';

import Can from 'src/lib/casl/can';
import UserContactCard from 'src/app/(app)/_components/user-contact-card';
import {
  getUserNotes,
  getUserProjects,
  getUserExperiences,
  getUserCertificates,
} from 'src/services/user';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import AccountSocial from './account-social';
import AccountResume from './account-resume';
import AccountAboutMe from './account-about-me';
import AccountProjects from './account-projects';
import AccountHRReview from './account-hr-review';
import AccountExperiences from './account-experiences';
import AccountCertificates from './account-certificates';
import { useManagedUser } from '../../../_context/use-managed-user';

// ----------------------------------------------------------------------

export default function AccountBody() {
  const { user } = useManagedUser();
  const {
    data: { projects, experiences, certificates, notes },
    pending,
  } = useQueries({
    queries: [
      {
        queryKey: ['account-project', user?.id],
        queryFn: () => getUserProjects({ user_id: user?.id }),
        enabled: !!user?.id,
      },
      {
        queryKey: ['account-experience', user?.id],
        queryFn: () => getUserExperiences({ user_id: user?.id }),
        enabled: !!user?.id,
      },
      {
        queryKey: ['account-certificate', user?.id],
        queryFn: () => getUserCertificates({ user_id: user?.id }),
        enabled: !!user?.id,
      },
      {
        queryKey: ['account-note', user?.id],
        queryFn: () => getUserNotes({ user_id: user?.id }),
        enabled: !!user?.id,
      },
    ],
    combine: results => ({
      pending: results.some(result => result.isPending),
      error: results.some(result => result.isError),
      data: {
        projects: results[0].data,
        experiences: results[1].data?.results,
        certificates: results[2].data?.results,
        notes: results[3].data?.results,
      },
    }),
  });

  return (
    <SplashWrapper isLoading={pending}>
      <Stack spacing={2} sx={{ mt: 4 }}>
        <UserContactCard user={user} />
        <AccountAboutMe />
        <AccountExperiences experiences={experiences} />
        <AccountProjects projects={projects} />
        <AccountCertificates certificates={certificates} />
        <AccountSocial />
        <Can I="update" a="customuser">
          <AccountHRReview hrOpinions={notes ?? []} />
        </Can>
        <AccountResume />
      </Stack>
    </SplashWrapper>
  );
}

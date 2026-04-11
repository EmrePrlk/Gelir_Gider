'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { BASE_QUERY_TAG } from 'src/config/constants';
import { getProjectById } from 'src/services/projects';
import { useProjectStore } from 'src/stores/project-list-store';
import { withErrorHandling } from 'src/hoc/with-error-handling';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

function DashboardProjectLayout({
  params,
  children,
}: {
  params: { projectId: string };
  children: React.ReactNode;
}) {
  const [setProject] = useProjectStore(state => [state.setProject]);
  const { data, isLoading } = useQuery({
    queryKey: ['project', params.projectId],
    queryFn: () => getProjectById(Number(params.projectId)),
    enabled: !!params.projectId,
    meta: {
      tags: [BASE_QUERY_TAG],
    },
  });

  useEffect(() => {
    if (data) {
      setProject(data);
    }
  }, [data, setProject]);

  return <SplashWrapper isLoading={isLoading}>{children}</SplashWrapper>;
}

export default withErrorHandling(DashboardProjectLayout);

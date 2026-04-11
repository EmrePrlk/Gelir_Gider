'use client';

import { useQuery } from '@tanstack/react-query';

import { Stack } from '@mui/material';

import { getIdea } from 'src/services/idea';
import { BASE_QUERY_TAG } from 'src/config/constants';

import { AlertError } from 'src/components/form-error';
import FormProvider from 'src/components/hook-form/form-provider';
import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import IdeaForm from './idea-form';
import { useIdeaForm } from '../_hooks/use-idea-form';

interface IdeaFormViewProps {
  ideaId?: number;
}

export default function IdeaManageView({ ideaId }: IdeaFormViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['idea', ideaId],
    queryFn: () => getIdea(ideaId!),
    enabled: !!ideaId,
    meta: {
      tags: [BASE_QUERY_TAG],
    },
  });

  const { methods, onSubmit, errorMsg, submitting } = useIdeaForm(data);

  return (
    <SplashWrapper isLoading={isLoading}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <AlertError error={errorMsg} />
          <IdeaForm submitting={submitting} />
        </Stack>
      </FormProvider>
    </SplashWrapper>
  );
}

'use client';

import React from 'react';

import DeveloperForm from './developer-form';
import useLandingBaseForm from '../../_hooks/use-landing-base-form';
import { useDeveloperFormSchema } from './use-developer-form-schema';
import LandingBaseFormView from '../../_components/landing-base-form-view';

export default function DeveloperFormView() {
  const { developerFormSchema, developerFormDefaultValues } =
    useDeveloperFormSchema();
  const { methods, onSubmit, isSubmitting, errorMsg } = useLandingBaseForm(
    developerFormSchema,
    developerFormDefaultValues,
  );

  return (
    <LandingBaseFormView
      methods={methods}
      onSubmit={onSubmit}
      errorMsg={errorMsg}
    >
      <DeveloperForm isSubmitting={isSubmitting} />
    </LandingBaseFormView>
  );
}

'use client';

import React from 'react';

import IdeatorForm from './ideator-form';
import useLandingBaseForm from '../../_hooks/use-landing-base-form';
import LandingBaseFormView from '../../_components/landing-base-form-view';
import {
  ideatorFormSchema,
  ideatorFormDefaultValues,
} from './ideator-form-schema';

export default function IdeatorFormView() {
  const { methods, onSubmit, isSubmitting, errorMsg } = useLandingBaseForm(
    ideatorFormSchema,
    ideatorFormDefaultValues,
  );

  return (
    <LandingBaseFormView
      methods={methods}
      onSubmit={onSubmit}
      errorMsg={errorMsg}
    >
      <IdeatorForm isSubmitting={isSubmitting} />
    </LandingBaseFormView>
  );
}

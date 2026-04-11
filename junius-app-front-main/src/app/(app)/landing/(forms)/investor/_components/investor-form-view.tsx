'use client';

import React from 'react';

import InvestorForm from './investor-form';
import useLandingBaseForm from '../../_hooks/use-landing-base-form';
import LandingBaseFormView from '../../_components/landing-base-form-view';
import {
  investorFormSchema,
  investorFormDefaultValues,
} from './investor-form-schema';

export default function InvestorFormView() {
  const { methods, onSubmit, isSubmitting, errorMsg } = useLandingBaseForm(
    investorFormSchema,
    investorFormDefaultValues,
  );

  return (
    <LandingBaseFormView
      methods={methods}
      onSubmit={onSubmit}
      errorMsg={errorMsg}
    >
      <InvestorForm isSubmitting={isSubmitting} />
    </LandingBaseFormView>
  );
}

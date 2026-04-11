import React from 'react';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import { useAbilityState } from './use-ability-state';

export function withAbility<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAbilityComponent(props: P) {
    const { isLoading, isError } = useAbilityState();

    if (isError) {
      // redirect to error500 page
    }

    return (
      <SplashWrapper isLoading={isLoading} animation="animation">
        <WrappedComponent {...props} />
      </SplashWrapper>
    );
  };
}

import { useContext } from 'react';

import { AbilityContext } from 'src/lib/casl/ability-context';

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('Ability context must be used within an AbilityProvider');
  }
  return ability;
}

'use client';
import { createContextualCan } from '@casl/react';

import { AbilityContext } from 'src/lib/casl/ability-context';

import { type IAppAbility } from './ability';

const Can = createContextualCan(
  AbilityContext.Consumer as React.Consumer<IAppAbility>,
);

export default Can;

'use client';

import { createContext } from 'react';

import { type IAppAbility } from './ability';

export const AbilityContext = createContext<IAppAbility | null>(null);

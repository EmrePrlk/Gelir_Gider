'use client';
import { useEffect, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';

import { getRoleGroups } from 'src/services/definitions';
import { useDefinitionStore } from 'src/stores/definition-store';

export function useInitDefinitions() {
  const [roleGroups] = useQueries({
    queries: [
      {
        queryKey: ['role-groups'],
        queryFn: getRoleGroups,
        retry: false,
        staleTime: 15 * 60 * 1000, // 15 minutes
      },
      // You can add more queries here, for the other definitions
    ],
  });

  const setPermissions = useDefinitionStore(state => state.setPermissions);

  const updatePermissions = useCallback(() => {
    const { data } = roleGroups;
    if (data) {
      data.results.forEach(group =>
        setPermissions(group.id, group.permissions ?? []),
      );
    }
  }, [roleGroups, setPermissions]);

  useEffect(() => {
    updatePermissions();
  }, [updatePermissions]);
}

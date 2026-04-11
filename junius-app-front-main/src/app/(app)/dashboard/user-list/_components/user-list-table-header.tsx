import { useQueries } from '@tanstack/react-query';

import { Tab, Tabs, alpha } from '@mui/material';

import { Status } from 'src/definitions';
import { getUsers } from 'src/services/user';
import { useUserListStore } from 'src/stores/user-list-store';

import Label, { type LabelColor } from 'src/components/label';

export default function UserListTableHeader() {
  const [filters, setFilters, totalResults] = useUserListStore(state => [
    state.filters,
    state.setFilters,
    state.totalResults,
  ]);

  const statusQueries = useQueries({
    queries: Object.values(Status).map(status => ({
      queryKey: ['management-users-list', status],
      queryFn: async () => {
        const res = await getUsers({
          status,
          limit: 1,
        });

        return { count: res.totalResults, status };
      },
    })),
    combine: results => ({
      data: results.map(result => result.data),
      pending: results.some(result => result.isPending),
    }),
  });

  const handleFilterStatus = (_: unknown, newValue: Status) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFilters({ status: newValue === 'all' ? undefined : newValue });
  };

  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    ...Object.values(Status).map(status => ({
      value: status,
      label: status,
    })),
  ];

  if (statusQueries.pending) return null;
  return (
    <Tabs
      value={filters.status || 'all'}
      onChange={handleFilterStatus}
      sx={{
        px: 2.5,
        boxShadow: theme =>
          `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {STATUS_OPTIONS.map(tab => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={
                tab.value === (filters.status || 'all') ? 'filled' : 'soft'
              }
              color={getLabelColor(tab.value)}
            >
              {tab.value === 'all'
                ? totalResults
                : statusQueries.data?.find(status =>
                    status ? status.status === tab.value : false,
                  )?.count || 0}
            </Label>
          }
        />
      ))}
    </Tabs>
  );
}

const getLabelColor = (status: Status | string): LabelColor => {
  switch (status) {
    case Status.ACTIVE: {
      return 'success';
    }
    case Status.PENDING: {
      return 'warning';
    }
    case Status.SUSPENDED: {
      return 'error';
    }
    case Status.REJECTED: {
      return 'error';
    }
    case Status.INACTIVE: {
      return 'default';
    }
    default: {
      return 'default';
    }
  }
};

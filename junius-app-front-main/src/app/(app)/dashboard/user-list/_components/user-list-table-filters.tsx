import debounce from 'lodash/debounce';
import { useState, useCallback } from 'react';

import {
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  type SelectChangeEvent,
} from '@mui/material';

import { useUserListStore } from 'src/stores/user-list-store';
import { RoleGroupEnum, getRoleGroupById } from 'src/definitions/role-group';

import Iconify from 'src/components/iconify';

import UserListTableFiltersResult from './user-list-table-filters-results';

export default function UserListTableFilters() {
  const [filters, setFilters, canReset] = useUserListStore(state => [
    state.filters,
    state.setFilters,
    state.canReset,
  ]);

  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const debouncedSetFilters = useCallback(
    (value: string) => {
      const debouncedFn = debounce((v: string) => {
        setFilters({ search: v });
      }, 300);
      debouncedFn(value);
    },
    [setFilters],
  );

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLocalSearch(value);
    debouncedSetFilters(value);
  };

  const handleFilterRole = (event: SelectChangeEvent<number | ''>) => {
    setFilters({
      type_of_user:
        Number(event.target.value) === 0
          ? undefined
          : Number(event.target.value),
    });
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            value={filters.type_of_user ?? ''}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.values(RoleGroupEnum).map(option => {
              const roleGroup = getRoleGroupById(option as number);
              return roleGroup ? (
                <MenuItem key={option} value={option}>
                  {roleGroup.name}
                </MenuItem>
              ) : null;
            })}
          </Select>
        </FormControl>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={localSearch}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      {canReset && <UserListTableFiltersResult />}
    </>
  );
}

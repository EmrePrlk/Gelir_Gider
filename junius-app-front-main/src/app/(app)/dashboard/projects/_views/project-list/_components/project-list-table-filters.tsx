import { startCase } from 'lodash';
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

import { Industry } from 'src/definitions/industries';
import { ProjectStatus } from 'src/definitions/project-status';
import { useProjectListStore } from 'src/stores/project-list-store';

import Iconify from 'src/components/iconify';

import ProjectListTableFiltersResult from './project-list-table-filters-results';

export default function ProjectListTableFilters() {
  const [filters, setFilters, canReset] = useProjectListStore(state => [
    state.filters,
    state.setFilters,
    state.canReset,
  ]);

  const [localTitle, setLocalTitle] = useState(filters.title || '');

  const debouncedSetFilters = useCallback(
    (value: string) => {
      const debouncedFn = debounce((v: string) => {
        setFilters({ title: v });
      }, 300);
      debouncedFn(value);
    },
    [setFilters],
  );

  const handleFilterProjectTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setLocalTitle(value);
    debouncedSetFilters(value);
  };

  const handleFilterCategory = (event: SelectChangeEvent<Industry | ''>) => {
    const { value } = event.target;
    setFilters({
      category: value ? (value as Industry) : undefined,
    });
  };

  const handleFilterStatus = (event: SelectChangeEvent<ProjectStatus | ''>) => {
    const { value } = event.target;
    setFilters({
      status: value ? (value as ProjectStatus) : undefined,
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        >
          <TextField
            fullWidth
            value={localTitle}
            onChange={handleFilterProjectTitle}
            placeholder="Search Project Title..."
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

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category as Industry | undefined}
            onChange={handleFilterCategory}
            input={<OutlinedInput label="Category" />}
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            {Object.values(Industry).map(category => (
              <MenuItem key={category} value={category}>
                {startCase(category.replaceAll('_', ' ').toLowerCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status ?? ''}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Status" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.values(ProjectStatus).map(status => (
              <MenuItem key={status} value={status}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {status}
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          flexGrow={1}
          sx={{ width: 1 }}
        />
      </Stack>

      {canReset && <ProjectListTableFiltersResult />}
    </>
  );
}

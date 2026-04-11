import {
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  type StackProps,
} from '@mui/material';

import { useUserListStore } from 'src/stores/user-list-store';
import { getRoleGroupById } from 'src/definitions/role-group';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableFiltersResult() {
  const [filters, setFilters, resetFilters, totalResults] = useUserListStore(
    state => [
      state.filters,
      state.setFilters,
      state.resetFilters,
      state.totalResults,
    ],
  );

  const handleRemoveKeyword = () => {
    setFilters({ search: '' });
  };

  const handleRemoveStatus = () => {
    setFilters({ status: undefined });
  };

  const handleRemoveRole = () => {
    setFilters({ type_of_user: null });
  };

  return (
    <Stack spacing={1.5} sx={{ p: 2.5, pt: 0 }}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults} results found</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {filters.status !== undefined && (
          <Block label="Status:">
            <Chip
              size="small"
              label={filters.status}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!filters.type_of_user && (
          <Block label="Role:">
            <Chip
              label={getRoleGroupById(filters.type_of_user)?.name}
              size="small"
              onDelete={handleRemoveRole}
            />
          </Block>
        )}

        {!!filters.first_name && (
          <Block label="Name:">
            <Chip
              label={filters.first_name}
              size="small"
              onDelete={handleRemoveKeyword}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={resetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

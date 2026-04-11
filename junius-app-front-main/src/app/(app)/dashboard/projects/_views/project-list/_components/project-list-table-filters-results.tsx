import {
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  type StackProps,
} from '@mui/material';

import { useProjectListStore } from 'src/stores/project-list-store';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProjectTableFiltersResult() {
  const [filters, setFilters, resetFilters, totalResults] = useProjectListStore(
    state => [
      state.filters,
      state.setFilters,
      state.resetFilters,
      state.totalResults,
    ],
  );

  const handleRemoveStatus = () => {
    setFilters({ status: undefined });
  };
  const handleRemoveCategory = () => {
    setFilters({ category: undefined });
  };
  const handleRemoveTitle = () => {
    setFilters({ title: undefined });
  };

  return (
    <Stack spacing={1.5} sx={{ p: 2.5, pt: 0 }}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
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
        {filters.title && (
          <Block label="Project Title:">
            <Chip
              size="small"
              label={filters.title}
              onDelete={handleRemoveTitle}
            />
          </Block>
        )}
        {filters.category && (
          <Block label=" Project Category:">
            <Chip
              size="small"
              label={filters.category}
              onDelete={handleRemoveCategory}
            />
          </Block>
        )}

        {filters.status && (
          <Block label="Status:">
            <Chip
              size="small"
              label={filters.status}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {filters.title || filters.category || filters.status ? (
          <Button
            color="error"
            onClick={resetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        ) : null}
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

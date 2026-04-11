import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

import { useProjectListStore } from 'src/stores/project-list-store';

// ----------------------------------------------------------------------

export default function ProjectListTablePagination() {
  const [limit, page, totalResults, changePage] = useProjectListStore(state => [
    state.limit,
    state.page,
    state.totalResults,
    state.changePage,
  ]);

  return (
    <Box sx={{ position: 'relative' }}>
      <TablePagination
        rowsPerPageOptions={[limit]}
        component="div"
        sx={{
          borderTopColor: 'transparent',
        }}
        count={totalResults}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => changePage(newPage + 1)}
      />
    </Box>
  );
}

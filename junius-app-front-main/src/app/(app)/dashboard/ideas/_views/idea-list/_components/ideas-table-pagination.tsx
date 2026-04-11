import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

import { useIdeasStore } from 'src/stores/ideas-store';

// ----------------------------------------------------------------------

export default function IdeasTablePagination() {
  const [limit, page, totalResults, changePage] = useIdeasStore(state => [
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

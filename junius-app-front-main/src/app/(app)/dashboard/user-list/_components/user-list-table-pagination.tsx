import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

import { useUserListStore } from 'src/stores/user-list-store';

// ----------------------------------------------------------------------

export default function UserListTablePagination() {
  const [limit, page, totalResults, changePage] = useUserListStore(state => [
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

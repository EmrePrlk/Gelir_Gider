import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { TableBody } from '@mui/material';

import { Status } from 'src/definitions';
import { paths } from 'src/config/paths';
import { getIdeas } from 'src/services/idea';
import { useIdeasStore } from 'src/stores/ideas-store';

import { TableNoData, TableSkeleton } from 'src/components/table';

import { type IIdea } from 'src/types/idea';

import IdeaTableRow from './ideas-table-row';

interface IdeasTableBodyProps {
  compactMode?: boolean;
}

function IdeasTableData({ compactMode }: IdeasTableBodyProps) {
  const router = useRouter();

  const [setPagination, page, limit, setFilters] = useIdeasStore(state => [
    state.setPagination,
    state.page,
    state.limit,
    state.setFilters,
  ]);

  useEffect(() => {
    if (compactMode) {
      setFilters({ status: Status.ACTIVE });
    }
  }, [compactMode, setFilters]);

  const {
    data: ideas,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['ideas-list', { page, limit }],
    queryFn: () => getIdeas({ page, limit }),
  });

  useEffect(() => {
    if (isSuccess) {
      setPagination(ideas);
    }
  }, [ideas, isSuccess, setPagination]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!ideas?.results.length || error) {
    return <TableNoData notFound />;
  }

  const navigateToIdeaDetail = (idea: IIdea) => {
    router.push(paths.dashboard.ideas.view(idea.id.toString()));
  };

  return (
    <>
      {ideas.results.map(row => (
        <IdeaTableRow
          key={row.id}
          row={row}
          onClick={() => navigateToIdeaDetail(row)}
          compactMode={compactMode}
        />
      ))}
    </>
  );
}

export default function IdeasTableBody({
  compactMode = false,
}: IdeasTableBodyProps) {
  return (
    <TableBody>
      <IdeasTableData compactMode={compactMode} />
    </TableBody>
  );
}

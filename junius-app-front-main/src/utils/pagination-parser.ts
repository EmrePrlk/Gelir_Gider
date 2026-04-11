import {
  type PaginationResponse as DesiredPagination,
  type PaginationRequest as DesiredPaginationRequest,
} from 'src/types/pagination';

export interface ActualPaginationResponse<T> {
  results: T[];
  count: number;
  next: string;
  previous: string;
}

export interface ActualPaginationRequest {
  offset: number;
  limit: number;
}

export function parse2DesiredPagination<T>(
  actual: ActualPaginationResponse<T>,
): DesiredPagination<T> {
  const limit = 25;
  const totalResults = actual.count;
  const totalPages = Math.ceil(totalResults / limit);

  let page;
  if (actual.next) {
    const nextOffset = Number.parseInt(
      new URL(actual.next).searchParams.get('offset') || '0',
      10,
    );
    page = Math.floor(nextOffset / limit);
  } else if (actual.previous) {
    const prevOffset = Number.parseInt(
      new URL(actual.previous).searchParams.get('offset') || '0',
      10,
    );
    page = Math.floor(prevOffset / limit) + 2;
  } else {
    page = 1;
  }

  return {
    results: actual.results,
    page,
    limit,
    totalPages,
    totalResults,
  };
}
export function parse2ActualPaginationRequest(
  expected: DesiredPaginationRequest,
): ActualPaginationRequest {
  const offset = (expected.page - 1) * expected.limit;

  return {
    offset,
    limit: expected.limit,
  };
}

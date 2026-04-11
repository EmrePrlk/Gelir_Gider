export interface PaginationResponse<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginationRequest {
  page: number;
  limit: number;
}

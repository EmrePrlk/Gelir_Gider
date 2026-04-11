# User List Component Documentation

## Introduction

The user-list component is a complex feature that displays a list of users with filtering, pagination, and CRUD operations. This guide will help you duplicate and modify this component for your specific needs.

## Step 1: Duplicate the Component

1. Copy the entire `dashboard/user-list` folder and rename it to your desired component name (e.g., `dashboard/product-list`).

2. Update the main component file:
   - Rename `user-list-table-view.tsx` to `product-list-table-view.tsx`
   - Update the component name and imports:

```typescript :src/app/(app)/dashboard/product-list/_components/product-list-table-view.tsx
import ProductListTable from './product-list-table';
import ProductListPageHeader from './product-list-page-header';

export default function ProductListTableView() {
  // ... (keep the rest of the code the same)
}
```

## Step 2: Create a New Store

1. Create a new file for your entity, e.g., `product-list-store.ts` in the `src/stores` directory.

2. Implement the store according to your entity's needs. Here's an example structure:

```typescript :src/stores/product-list-store.ts
import { create } from 'zustand';

import { type IProduct } from 'src/types/product';

type IFilters = Partial<IProduct> & { search?: string };

type ProductListStore = {
  filters: IFilters;
  canReset: boolean;

  setFilters: (filters: IFilters) => void;
  resetFilters: () => void;
};

const initialFilters: IFilters = {
  category: undefined,
  status: undefined,
  search: '',
};

export const useProductListStore = create<ProductListStore>(set => ({
  filters: initialFilters,
  canReset: false,

  setFilters: newFilters =>
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      return {
        filters: updatedFilters,
        canReset:
          JSON.stringify(updatedFilters) !== JSON.stringify(initialFilters),
      };
    }),
  resetFilters: () =>
    set({
      filters: initialFilters,
      canReset: false,
    }),
}));
```

## Step 3: Implement React Query

React Query is a powerful library for managing server state in React applications. Here's how to use it effectively in your list component:

1. Set up the query in your main component file:

```typescript :src/app/(app)/dashboard/product-list/_components/product-list-table-body.tsx
import { useQuery } from '@tanstack/react-query';
import { getProducts } from 'src/services/product';
import { useProductListStore } from 'src/stores/product-list-store';

function ProductListTableData() {
  const [filters] = useProductListStore(state => [state.filters]);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product-list', filters],
    queryFn: () => getProducts(filters),
  });

  // Render logic here
}
```

2. Handle different states:

```typescript :src/app/(app)/dashboard/product-list/_components/product-list-table-body.tsx
startLine: 1;
endLine: 60;
```

3. Revalidation and Query Keys:
   - Use appropriate query keys to automatically refetch data when dependencies change.
   - Invalidate queries when needed:

```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['product-list'] });
```

4. Optimistic Updates:
   - Implement optimistic updates for better user experience:

```typescript :src/app/(app)/dashboard/product-list/_components/product-list-table-row-actions.tsx
startLine: 33;
endLine: 72;
```

5. Pagination:
   - Implement pagination using React Query:

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ['product-list', filters],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...filters, page: pageParam }),
    getNextPageParam: lastPage => lastPage.nextPage,
  });
```

6. Mutations:
   - Use mutations for create, update, and delete operations:

```typescript
const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['product-list'] });
  },
});

// Usage
mutation.mutate({ id: productId, data: updatedData });
```

## Step 3: Update API Services

1. Create a new file `src/services/product.ts` based on the `user.ts` file:

```typescript :src/services/product.ts
import { serializeParams } from 'src/utils/serialize-params';
import type {
  IProduct,
  IProductListRequest,
  IProductListResponse,
} from 'src/types/product';
import { secureApi } from './instance';

export const getProducts = async (
  data: IProductListRequest,
): Promise<IProductListResponse> => {
  const response = await secureApi.get<IProductListResponse>(
    `/products/${serializeParams(data)}`,
  );
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<IProduct>,
): Promise<IProduct> => {
  const response = await secureApi.patch<IProduct>(`/products/${id}/`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await secureApi.delete(`/products/${id}/`);
};
```

## Step 4: Update Table Components

1. Update `product-list-table.tsx`:

   - Replace `UserListTableBody` with `ProductListTableBody`
   - Update the `TABLE_HEAD` constant to match your product properties

2. Update `product-list-table-body.tsx`:

   - Replace `IUser` with `IProduct`
   - Update the query key to `['management-products-list']`
   - Update the API call to `getProducts`

3. Update `product-list-table-row.tsx`:

   - Replace `IUser` with `IProduct`
   - Update the row rendering to match your product properties

4. Update `product-list-table-row-actions.tsx`:
   - Update the query key to `['management-products-list']`
   - Update the API calls to `deleteProduct`

## Step 5: Update Filters and Headers

1. Update `product-list-table-filters.tsx`:

   - Modify the filter options to match your product properties

2. Update `product-list-table-header.tsx`:
   - Adjust the status options and API calls to match your product statuses

## Step 6: Update Types

Create a new file `src/types/product.ts`:

```typescript :src/types/product.ts
import { Status } from 'src/definitions/statuses';
import { PaginationResponse, PaginationRequest } from './pagination';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  status: Status;
  // Add more properties as needed
}

export type IProductListResponse = PaginationResponse<IProduct>;
export type IProductListRequest = Partial<PaginationRequest & IProduct>;
```

## Step 7: Update Page Component

Update the `page.tsx` file in your new product list folder:

```typescript 1:10:src/app/(app)/dashboard/product-list/page.tsx
import UserListTableView from './_components/user-list-table-view';

export const metadata = {
  title: 'Dashboard: User List',
};

export default function UserListPage() {
  return <UserListTableView />;
}
```

Replace `UserListTableView` with `ProductListTableView` and update the metadata title.

## Conclusion

By following these steps, you can duplicate the user-list component and modify it to create a new list component for any entity in your application. Remember to adjust the API endpoints, types, and UI elements to match your specific entity's properties and requirements.

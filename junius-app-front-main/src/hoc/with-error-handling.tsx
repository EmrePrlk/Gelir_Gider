import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, type ComponentType } from 'react';

import View403 from 'src/app/error/views/403-view';
import Page500 from 'src/app/error/views/500-view';
import { BASE_QUERY_TAG } from 'src/config/constants';
import NotFoundView from 'src/app/error/views/not-found-view';

const ERRORS = new Set([403, 404, 500]);

export function withErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  return function ErrorHandlingComponent(props: P) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<number | null>(null);

    useEffect(() => {
      const unsubscribe = queryClient.getQueryCache().subscribe(event => {
        if (event?.query.state.error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const queryError = event.query.state.error;
          if (queryError instanceof AxiosError) {
            const errorStatus = queryError.response?.status;
            const queryTags = event.query.meta?.tags || [];
            if (
              errorStatus &&
              ERRORS.has(errorStatus) &&
              (queryTags as string[]).includes(BASE_QUERY_TAG)
            ) {
              setError(errorStatus);
            }
          }
        }
      });

      return () => {
        unsubscribe();
      };
    }, [queryClient]);

    if (error === 403) {
      return <View403 />;
    }

    if (error === 404) {
      return <NotFoundView />;
    }

    if (error === 500) {
      return <Page500 />;
    }

    return <WrappedComponent {...props} />;
  };
}

/* eslint-disable react-hooks/exhaustive-deps */
import { CommonQueryParams } from '@/types';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useCallback, useEffect, useState } from 'react';

export const isValidArray = (array: any[]): boolean => {
  return Array.isArray(array) && array.length > 0;
};
interface Params extends CommonQueryParams {
  useGetDataListQuery: UseQuery<any>;
  params?: CommonQueryParams;
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
  pollingInterval?: number;
  defaultPage?: number;
}
const useInfinitePageQuery = <T>({
  useGetDataListQuery,
  params,
  skip = false,
  refetchOnMountOrArgChange = false,
  pollingInterval,
  defaultPage = 1,
}: Params) => {
  const [page, setPage] = useState<number>(defaultPage);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState<T[]>([]);
  const { data, isLoading, isFetching, isSuccess, isError, currentData } =
    useGetDataListQuery(
      {
        page,
        ...params,
      },
      {
        skip,
        refetchOnMountOrArgChange,
        pollingInterval,
      },
    );
  useEffect(() => {
    if (Array.isArray(data)) {
      if (page === defaultPage) {
        setCombinedData(data as any[]);
      } else {
        if (isValidArray(data)) {
          setCombinedData(previousData => {
            return [...previousData, ...(data as any[])];
          });
        }
      }
    }
    setRefreshing(false);
  }, [data]);

  const refresh = useCallback(() => {
    setCombinedData([]);
    setPage(1);
    setRefreshing(true);
  }, []);

  const loadMore = () => {
    const limit = (params && params?.itemPerPage) || params?.pageSize || 10;
    if (isValidArray(data as any[])) {
      setPage(page + 1);
    }
  };

  return {
    combinedData,
    page,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    currentData,
    refreshing,
    loadMore,
    refresh,
  };
};

export default useInfinitePageQuery;

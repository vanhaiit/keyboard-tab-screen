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
}
const useInfiniteQuery = <T>({
  useGetDataListQuery,
  params,
  skip = false,
  refetchOnMountOrArgChange = false,
  pollingInterval,
}: Params) => {
  const [start, setStart] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [combinedData, setCombinedData] = useState<T[]>([]);
  const { data, isLoading, isFetching, isSuccess, isError, currentData } =
    useGetDataListQuery(
      {
        _start: start,
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
      if (start === 0) {
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
    setStart(0);
    setRefreshing(true);
  }, []);

  const loadMore = () => {
    const limit = (params && params?._limit) || 10;
    if (isValidArray(data as any[]) && (data as any[])?.length >= limit) {
      setStart(start + limit);
    }
  };

  return {
    combinedData,
    start,
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

export default useInfiniteQuery;

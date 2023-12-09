import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import { EarnActions, ChartData, EarnSummary } from '../types';

export const postApi = api.injectEndpoints({
  endpoints: build => ({
    getEarnChartData: build.query<ChartData[], { filter: '7d' | '30d' }>({
      query: params => {
        return {
          url: 'get-chart-data',
          params,
        };
      },
    }),
    getEarnActions: build.query<
      EarnActions[],
      { page: number; itemPerPage: number }
    >({
      query: params => {
        return {
          url: 'get-earning-actions',
          params,
        };
      },
      transformResponse: (response: { data: EarnActions[] }) => {
        return response.data;
      },
    }),
    getEarnSummary: build.query<EarnSummary[], CommonQueryParams>({
      query: params => {
        return {
          url: 'get-earn-data-summary',
          params,
        };
      },
      transformResponse: (response: { data: EarnSummary[] }) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useGetEarnChartDataQuery,
  useGetEarnActionsQuery,
  useGetEarnSummaryQuery,
} = postApi;

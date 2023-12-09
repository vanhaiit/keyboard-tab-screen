import { DAO, UserProfile } from '@/features/profile/types';
import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import { FilterTypes, LeaderDaosFilters } from '../types';

export const leaderBoardApi = api.injectEndpoints({
  endpoints: build => ({
    getMostFollowed: build.query<
      UserProfile[],
      CommonQueryParams & {
        timeFilter?: FilterTypes;
      }
    >({
      query: (
        params: CommonQueryParams & {
          timeFilter?: FilterTypes;
        },
      ) => {
        return {
          url: 'get-most-followed',
          params,
        };
      },
    }),
    getTopDaos: build.query<
      DAO[],
      CommonQueryParams & {
        filterTarget?: LeaderDaosFilters;
      }
    >({
      query: (
        params: CommonQueryParams & {
          filterTarget?: LeaderDaosFilters;
        },
      ) => {
        return {
          url: 'get-top-daos',
          params,
        };
      },
    }),
  }),
});

export const { useGetMostFollowedQuery, useGetTopDaosQuery } = leaderBoardApi;

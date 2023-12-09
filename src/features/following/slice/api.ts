import { UserProfile } from '@/features/profile/types';
import { baseQueryApi as api } from '@/store/baseQueryApi';
import {
  DAOData,
  FollowData,
  ParamsQuery,
  PayLoadTag,
  TagData,
} from '../types';

export const followApi = api.injectEndpoints({
  endpoints: build => ({
    getListFollow: build.query<FollowData[], ParamsQuery>({
      query: (params: ParamsQuery) => {
        return {
          url: 'get-users-follow-state',
          params,
        };
      },
      providesTags: ['liked_users'],
    }),
    getListTag: build.query<TagData[], ParamsQuery>({
      query: (params: ParamsQuery) => {
        return {
          url: 'get-tags-follow-state',
          params,
        };
      },
    }),
    getListDAO: build.query<DAOData[], ParamsQuery>({
      query: (params: ParamsQuery) => {
        return {
          url: 'get-daos-follow-state',
          params,
        };
      },
    }),
    getProfile: build.query<UserProfile[], ParamsQuery>({
      query: (params: ParamsQuery) => {
        return {
          url: 'profiles',
          params,
        };
      },
    }),
    unFollowTag: build.mutation<any, PayLoadTag>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: 'unfollow-tag',
          method: 'POST',
          body: payload,
        });
      },
    }),
    followTag: build.mutation<any, PayLoadTag>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: 'follow-tag',
          method: 'POST',
          body: payload,
        });
      },
    }),
  }),
});

export const {
  useGetListFollowQuery,
  useGetListTagQuery,
  useGetListDAOQuery,
  useGetProfileQuery,
  useUnFollowTagMutation,
  useFollowTagMutation,
} = followApi;

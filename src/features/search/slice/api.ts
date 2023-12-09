import { baseQueryApi as api } from '@/store/baseQueryApi';
import { DAO as DAOPost } from '@/features/dao/types';
import { CommonQueryParams } from '@/types';
import { IPost } from '@/features/post/types/Post';
import { ISearchTags, ISearchUsers } from '../types';

export const profileApi = api.injectEndpoints({
  endpoints: build => ({
    getTags: build.query<ISearchTags[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/tags',
        params,
      }),
    }),

    getSearchForum: build.query<ISearchTags[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/search/forum',
        params,
      }),
      providesTags: ['related-tags'],
    }),

    getSearchUsers: build.query<ISearchUsers[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/search-users',
        params,
      }),
      transformResponse: (response: { data: ISearchUsers[] }, meta, params) => {
        return response.data;
      },
    }),

    getSearchDAO: build.query<DAOPost[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/search/dao',
        params,
      }),
    }),

    getSearchPost: build.query<IPost[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: '/search/post',
        params,
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetSearchForumQuery,
  useGetSearchUsersQuery,
  useGetSearchDAOQuery,
  useGetSearchPostQuery,
} = profileApi;

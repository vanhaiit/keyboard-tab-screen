import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import {
  DAOCategory,
  ICreateDAO,
  IDAODetail,
  IGenerateLink,
  IGetPostDAOQueryParams,
  IInviteParams,
  IUserInvite,
  IUpdateDAO,
  IUserDAO,
  PayloadCheckDuplicateDAONameParams,
} from '../types';
import { IPost } from '@/features/post/types/Post';

export const postApi = api.injectEndpoints({
  endpoints: build => ({
    getDaoCategory: build.query<DAOCategory[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'dao-categories',
          params,
        };
      },
    }),
    checkDuplicateDAOName: build.mutation<
      any,
      PayloadCheckDuplicateDAONameParams
    >({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: 'daos/check-duplicate-dao-name',
          method: 'POST',
          body: {
            name: payload.name,
          },
        });
      },
    }),
    createDAO: build.mutation<any, ICreateDAO>({
      query: payload => {
        return {
          url: 'daos/create-dao',
          method: 'POST',
          body: payload,
        };
      },
    }),
    getDAO: build.query<IDAODetail, string>({
      query: (id: string) => {
        return {
          url: `fetch-dao/${id}`,
        };
      },
    }),
    getPostDao: build.query<IPost, IGetPostDAOQueryParams>({
      query: (params: IGetPostDAOQueryParams) => {
        return {
          url: `daos/${params.id}/fetch-dao-posts`,
          params: { ...params.payload, _start: params._start },
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    getInviteLinks: build.query<any, string>({
      query: (id: string) => {
        return {
          url: `daos/${id}/get-invite-links`,
          params: {
            _limit: -1,
            _start: 0,
          },
        };
      },
    }),
    generateInviteLink: build.mutation<any, IGenerateLink>({
      query: payload => {
        return {
          url: `daos/${payload?.id}/generate-invite-link`,
          method: 'POST',
          body: {
            expiredTime: payload?.expiredTime,
            name: '',
          },
        };
      },
    }),
    modifierDao: build.mutation<any, IUpdateDAO>({
      query: payload => {
        return {
          url: `daos/${payload.id}/${payload.prefix}`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['update-member'],
    }),
    getListUserInvite: build.query<IUserInvite, IInviteParams>({
      query: (params: IInviteParams) => {
        return {
          url: `daos/${params?.id}/fetch-users-invite`,
          params: {
            _limit: params?._limit,
            _start: params?._start,
            _sort: params?._sort,
            unique_id_contains: params?.unique_id_contains,
          },
        };
      },
      transformResponse: (response: any) => response?.data,
    }),
    inviteJoinDAO: build.mutation<any, { id: string; receivers: string[] }>({
      query: payload => {
        return {
          url: `daos/${payload?.id}/invite-join-dao`,
          method: 'POST',
          body: {
            receivers: payload.receivers,
          },
        };
      },
    }),
    deleteInviteLink: build.mutation<any, { inviteLinkId: string }>({
      query: payload => {
        return {
          url: 'delete-invite-link',
          method: 'POST',
          body: payload,
        };
      },
    }),
    getUserDaos: build.query<IUserDAO[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'user-daos',
          params: params,
        };
      },
      providesTags: ['update-member'],
    }),
    getDaoReq: build.query<IUserDAO[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'dao-requests',
          params: params,
        };
      },
    }),
    getReportedPosts: build.query<IUserDAO[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: `daos/${params.id}/fetch-reported-posts`,
          params: params,
        };
      },
    }),
    actionJoinDaoRequest: build.mutation<
      {
        code: number;
        messages: string;
      },
      { id: string; requestId: string; prefix: string }
    >({
      query: payload => {
        return {
          url: `daos/${payload?.id}/${payload?.prefix}`,
          method: 'POST',
          body: payload,
        };
      },
    }),
    joinDao: build.mutation<any, { daoId: string }>({
      query: payload => {
        return {
          url: 'daos/join-dao',
          method: 'POST',
          body: payload,
        };
      },
    }),
    joinToDao: build.mutation<any, { daoId: string }>({
      query: payload => {
        return {
          url: `daos/${payload.daoId}/apply-to-join`,
          method: 'POST',
          body: payload,
        };
      },
    }),
    leaverDao: build.mutation<any, { daoId: string }>({
      query: payload => {
        return {
          url: 'daos/leave-dao',
          method: 'POST',
          body: payload,
        };
      },
    }),
    updateDao: build.mutation<any, ICreateDAO>({
      query: payload => {
        return {
          url: 'daos/update-dao',
          method: 'POST',
          body: payload,
        };
      },
    }),
  }),
});

export const {
  useGetDaoCategoryQuery,
  useCreateDAOMutation,
  useCheckDuplicateDAONameMutation,
  useGetDAOQuery,
  useGetPostDaoQuery,
  useGetInviteLinksQuery,
  useGenerateInviteLinkMutation,
  useGetListUserInviteQuery,
  useInviteJoinDAOMutation,
  useDeleteInviteLinkMutation,
  useModifierDaoMutation,
  useGetUserDaosQuery,
  useGetDaoReqQuery,
  useGetReportedPostsQuery,
  useActionJoinDaoRequestMutation,
  useJoinDaoMutation,
  useJoinToDaoMutation,
  useLeaverDaoMutation,
  useUpdateDaoMutation,
} = postApi;

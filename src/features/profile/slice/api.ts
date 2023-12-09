import { Profile, UserInfo } from '@/features/auth/types';
import { IPost } from '@/features/post/types/Post';
import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import {
  BookMarkedPost,
  CountFollowingParams,
  DAO,
  DAOUser,
  GetPostUserParams,
  IFetchComments,
  InviteDataResponse,
  LikedPost,
  RegisterRequestPayload,
  TopLink,
  TopTag,
  UpdateProfilePayload,
  UserProfile,
} from '../types';
interface GetDAOUserParams extends CommonQueryParams {
  role: string;
  profile: string;
}

export const profileApi = api.injectEndpoints({
  endpoints: build => ({
    getMyProfile: build.query<UserInfo, undefined>({
      query: () => ({
        url: '/users/me',
      }),
    }),
    getProfileInfo: build.query<UserProfile, string>({
      query: (profileId: string) => ({
        url: `/profiles/${profileId}`,
      }),
      providesTags: ['profile'],
    }),
    getLinks: build.query<TopLink[], string>({
      query: (profile: string) => ({
        url: `/links?profile=${profile}`,
      }),
    }),

    getDAOs: build.query<DAO[], string>({
      query: (profile: string) => ({
        url: `/daos?deleted=false&profile=${profile}`,
      }),
    }),

    getDAOUsers: build.query<DAOUser[], GetDAOUserParams>({
      query: (params: GetDAOUserParams) => {
        return {
          url: 'user-daos',
          params,
        };
      },
    }),

    getTopTags: build.query<TopTag[], string>({
      query: (profileId: string) => ({
        url: `/get-top-tags-profile/${profileId}`,
      }),
      providesTags: ['top_tags'],
    }),

    getMostLikedUsers: build.query<UserProfile[], string>({
      query: (profileId: string) => ({
        url: `/most-users-liked/${profileId}`,
      }),
      providesTags: ['liked_users'],
    }),

    followUser: build.mutation<any, { follow: string }>({
      query: payload => ({
        url: '/follow-user',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['liked_users', 'profile'],
    }),

    unFollowUser: build.mutation<any, { follow: string }>({
      query: payload => ({
        url: '/unfollow-user',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['liked_users', 'profile'],
    }),

    followTag: build.mutation<any, { tag: string }>({
      query: payload => ({
        url: '/follow-tag',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['top_tags', 'related-tags', 'posts'],
    }),

    unFollowTag: build.mutation<any, { tag: string }>({
      query: payload => ({
        url: '/unfollow-tag',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['top_tags', 'related-tags', 'posts'],
    }),

    countFollowing: build.query<number, CountFollowingParams>({
      query: params => ({
        url: '/user-followings/count',
        params,
      }),
    }),

    updateProfile: build.mutation<any, UpdateProfilePayload>({
      query: payload => ({
        url: '/profiles/update-user-profile',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['profile'],
    }),

    uploadImage: build.mutation<{}, FormData>({
      query(formData) {
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),

    getFetchPost: build.query<IPost[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'fetchPosts',
          params,
        };
      },
    }),

    getLikedPost: build.query<LikedPost[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'get-liked-posts',
          params,
        };
      },
    }),

    getBookMarkedPost: build.query<BookMarkedPost[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'get-bookmarked-posts',
          params,
        };
      },
    }),
    registerProfile: build.mutation<
      { profile: Profile },
      RegisterRequestPayload
    >({
      query: payload => ({
        url: '/profiles/create-user-profile',
        method: 'POST',
        body: payload,
      }),
    }),
    getInvites: build.query<InviteDataResponse, GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'get-invites',
          params,
        };
      },
    }),
    acceptDaoInvite: build.mutation<any, { inviteId: string }>({
      query: payload => ({
        url: 'accept-dao-invite',
        method: 'POST',
        body: payload,
      }),
    }),
    rejectDaoInvite: build.mutation<any, { inviteId: string }>({
      query: payload => ({
        url: 'reject-dao-invite',
        method: 'POST',
        body: payload,
      }),
    }),
    getDraftPost: build.query<IPost[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'fetchDraftPosts',
          params,
        };
      },
    }),
    publishDraftPost: build.mutation<IPost, { postId: string }>({
      query: payload => ({
        url: 'publishDraftPost',
        method: 'POST',
        body: payload,
      }),
    }),
    getFetchComments: build.query<IFetchComments[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'fetchComments',
          params,
        };
      },
    }),
    getProfileUniqueId: build.query<Profile[], GetPostUserParams>({
      query: (params: GetPostUserParams) => {
        return {
          url: 'profiles',
          params,
        };
      },
    }),
  }),
});

export const {
  useGetProfileInfoQuery,
  useGetLinksQuery,
  useGetDAOsQuery,
  useGetDAOUsersQuery,
  useGetTopTagsQuery,
  useGetMostLikedUsersQuery,
  useFollowUserMutation,
  useUnFollowUserMutation,
  useFollowTagMutation,
  useUnFollowTagMutation,
  useCountFollowingQuery,
  useUploadImageMutation,
  useUpdateProfileMutation,
  useGetFetchPostQuery,
  useGetLikedPostQuery,
  useGetBookMarkedPostQuery,
  useRegisterProfileMutation,
  useGetInvitesQuery,
  useAcceptDaoInviteMutation,
  useRejectDaoInviteMutation,
  useGetDraftPostQuery,
  usePublishDraftPostMutation,
  useGetFetchCommentsQuery,
  useGetProfileUniqueIdQuery,
} = profileApi;

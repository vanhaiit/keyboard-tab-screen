import { Profile } from '@/features/auth/types';
import { DAO } from '@/features/dao/types';
import { FilterTypes } from '@/features/Leaderboard/types';
import { UserProfile } from '@/features/profile/types';
import { baseQueryApi as api } from '@/store/baseQueryApi';
import { CommonQueryParams } from '@/types';
import dayjs from 'dayjs';
import {
  DeletePostResponse,
  GetMyFeedResponse,
  GetMyPostParams,
  GetUserProfileParams,
  LikePostResponse,
  MyFeedFilterTypes,
} from '../types';

import {
  Category,
  Comment,
  CreateCommentRequest,
  IPost,
  PayloadCreatePost,
  PostQueryParams,
} from '../types/Post';

import omitBy from 'lodash/omitBy';
import isNill from 'lodash/isNil';
export const postApi = api.injectEndpoints({
  endpoints: build => ({
    getMyFeeds: build.query<any, GetMyPostParams>({
      async queryFn(params, _queryApi, _extraOptions, baseQuery) {
        try {
          let url = '';
          let sort = '';
          let createdAtTime = null;
          const newParams: Partial<GetMyPostParams> = { ...params };
          delete newParams.queryType;
          delete newParams.userId;
          delete newParams.topOptions;
          switch (params.queryType) {
            case MyFeedFilterTypes.Following: {
              url = 'my-feed';
              sort = 'createdAt:desc';
              break;
            }
            case MyFeedFilterTypes.Latest: {
              url = 'fetchPosts';
              sort = 'createdAt:desc';
              break;
            }
            case MyFeedFilterTypes.Top: {
              url = 'fetchPosts';
              sort = 'topScore:desc';
              createdAtTime = dayjs()
                .subtract(params.topOptions || 0, 'd')
                .valueOf();
              break;
            }
            case MyFeedFilterTypes.Trending: {
              url = 'fetchPosts';
              sort = 'score:desc';
              break;
            }
            case MyFeedFilterTypes.User:
              url = 'profiles';
              sort = 'totalPosts:desc';
              break;
            case MyFeedFilterTypes.Dao:
              url = 'get-daos-to-join';
              sort = 'created:desc';
              break;
          }
          const response = (await baseQuery({
            url,
            params: omitBy(
              {
                ...newParams,
                _sort: sort,
                _createdAt_gte: createdAtTime,
              },
              isNill,
            ),
            method: 'GET',
          })) as {
            data: GetMyFeedResponse;
          };
          switch (params.queryType) {
            case MyFeedFilterTypes.Following: {
              return {
                ...response,
                data: response.data.posts,
              };
            }
            case MyFeedFilterTypes.Latest: {
              return {
                ...response,
                data: response.data,
              };
            }
            case MyFeedFilterTypes.Trending: {
              return {
                ...response,
                data: response.data,
              };
            }
            case MyFeedFilterTypes.Top: {
              return {
                ...response,
                data: response.data,
              };
            }
            case MyFeedFilterTypes.User: {
              let data = response.data as any;
              if (params.userId) {
                data = data.filter(
                  (item: UserProfile) => item.id !== params.userId,
                );
              }
              return {
                ...response,
                data: data,
              };
            }
            case MyFeedFilterTypes.Dao: {
              return {
                ...response,
                data: response.data.data,
              };
            }
            default:
              return {
                ...response,
                data: response.data.data,
              };
          }
        } catch {
          return {
            data: [],
          };
        }
      },
      providesTags: ['posts'],
    }),
    createPost: build.mutation<any, PayloadCreatePost>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: '/posts/create',
          method: 'POST',
          body: payload,
        });
      },
    }),
    getPosts: build.query<IPost[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'fetchPosts',
          params,
        };
      },
      providesTags: ['posts'],
    }),
    likePost: build.mutation<LikePostResponse, string>({
      query: postId => {
        return {
          url: 'like',
          method: 'POST',
          body: {
            post: postId,
          },
        };
      },
    }),
    unlikePost: build.mutation<LikePostResponse, string>({
      query: postId => {
        return {
          url: 'unlike',
          method: 'POST',
          body: {
            post: postId,
          },
        };
      },
    }),
    dislikePost: build.mutation<LikePostResponse, string>({
      query: postId => {
        return {
          url: 'dislike',
          method: 'POST',
          body: {
            post: postId,
          },
        };
      },
    }),
    unDislikePost: build.mutation<LikePostResponse, string>({
      query: postId => {
        return {
          url: 'un-dislike',
          method: 'POST',
          body: {
            post: postId,
          },
        };
      },
    }),
    addBookMark: build.mutation<LikePostResponse, string>({
      query: postId => {
        return {
          url: 'createBookmark',
          method: 'POST',
          body: {
            postId,
          },
        };
      },
    }),
    removeBookMark: build.mutation<LikePostResponse, string>({
      query: postId => ({
        url: 'removeBookmark',
        method: 'POST',
        body: {
          postId,
        },
      }),
    }),
    getPostCategories: build.query<Category[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'review-categories',
          params,
        };
      },
    }),
    vote: build.mutation<
      LikePostResponse,
      {
        pollId: string;
        voteOption: number;
      }
    >({
      query: params => {
        return {
          url: 'poll-vote',
          method: 'POST',
          body: params,
        };
      },
    }),
    deletePost: build.mutation<
      DeletePostResponse,
      {
        postId: string;
      }
    >({
      query: params => {
        return {
          url: 'delete-post',
          method: 'POST',
          body: params,
        };
      },
      invalidatesTags: ['posts'],
    }),
    reportPost: build.mutation<
      DeletePostResponse,
      {
        postId: string;
        reason: string;
      }
    >({
      query: params => {
        return {
          url: 'create-report',
          method: 'POST',
          body: params,
        };
      },
    }),
    reasonPost: build.mutation<
      DeletePostResponse,
      {
        id?: string;
        status?: boolean;
        reason: string;
      }
    >({
      query: params => {
        return {
          url: 'posts/update-blind-state',
          method: 'POST',
          body: params,
        };
      },
    }),
    blockUser: build.mutation<
      any,
      {
        blocked: string;
      }
    >({
      query: params => {
        return {
          url: 'block-user',
          method: 'POST',
          body: params,
        };
      },
    }),
    getUserProfile: build.query<Profile, GetUserProfileParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: 'get-user-profile',
          params,
        };
      },
    }),
    getDaoToJoin: build.query<DAO[], CommonQueryParams>({
      query: (params: CommonQueryParams) => ({
        url: 'get-daos-to-join',
        params,
      }),
      transformResponse: (response: { data: DAO[] }) => {
        return response.data;
      },
    }),
    getUserToFollow: build.query<UserProfile[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        const newParams = { ...params };
        let page = 0;
        if (
          !params.page &&
          params._start !== 0 &&
          params._start &&
          params._limit
        ) {
          page = params._start / params._limit;
          delete newParams._start;
        } else if (!params.page) {
          delete newParams._start;
        }

        return {
          url: 'get-users-to-follow',
          params: {
            ...newParams,
            page: params.page || page,
          },
        };
      },
      transformResponse: (response: { data: UserProfile[] }, meta, params) => {
        let data = response.data;
        if (params.userId) {
          data = data.filter((item: UserProfile) => item.id !== params.userId);
        }
        return data;
      },
    }),
    getLeadersEarn: build.query<
      UserProfile[],
      CommonQueryParams & {
        timeFilter?: FilterTypes;
      }
    >({
      query: (
        params: CommonQueryParams & {
          timeFilter?: FilterTypes;
        },
      ) => ({
        url: 'get-most-earned',
        params,
      }),
    }),
    getComments: build.query<Comment[], PostQueryParams>({
      query: (params: PostQueryParams) => {
        return {
          url: 'comments',
          params,
        };
      },
      providesTags: ['comments'],
    }),
    sendComment: build.mutation<Comment, CreateCommentRequest>({
      query: payload => {
        return {
          url: 'comments/createComment',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['comments', 'posts'],
    }),
    deleteComment: build.mutation<any, { id: string }>({
      query: payload => {
        return {
          url: 'comments/deleteComment',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['comments', 'posts'],
    }),
    editComment: build.mutation<any, Comment>({
      query: payload => {
        return {
          url: `comments/${payload.id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['comments'],
    }),

    getGoogleAPIKey: build.query<any, undefined>({
      query: () => ({
        url: '/get-google-api-key',
        responseHandler: response => {
          return response.text();
        },
      }),
    }),
    getPlaceImage: build.query<string, string>({
      query: (placeId: string) => ({
        url: `/get-place-detail?fields=name,geometry&placeId=${placeId}`,
        responseHandler: response => {
          return response.text();
        },
      }),
    }),
    updatePost: build.mutation<any, PayloadCreatePost>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        return await baseQuery({
          url: '/posts/update-post',
          method: 'POST',
          body: payload,
        });
      },
    }),
    getAllDAO: build.query<Comment[], CommonQueryParams>({
      query: (params: CommonQueryParams) => {
        return {
          url: '/get-all-related-daos',
          params,
        };
      },
    }),
  }),
});

export const {
  useLazyGetMyFeedsQuery,
  useGetMyFeedsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useAddBookMarkMutation,
  useCreatePostMutation,
  useRemoveBookMarkMutation,
  useGetPostsQuery,
  useLazyGetUserProfileQuery,
  useUnDislikePostMutation,
  useDislikePostMutation,
  useGetPostCategoriesQuery,
  useVoteMutation,
  useDeletePostMutation,
  useReportPostMutation,
  useReasonPostMutation,
  useBlockUserMutation,
  useGetCommentsQuery,
  useGetDaoToJoinQuery,
  useGetUserToFollowQuery,
  useGetLeadersEarnQuery,
  useSendCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetGoogleAPIKeyQuery,
  useLazyGetPlaceImageQuery,
  useUpdatePostMutation,
  useGetAllDAOQuery,
} = postApi;

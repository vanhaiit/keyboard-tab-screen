import Config from 'react-native-config';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from './type';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: Config.BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (!!token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  //const { getState } = api;

  //const isLoggedIn = !!(getState() as RootState).auth.accessToken;

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // const refreshToken = (getState() as RootState).auth
        // const refreshResult = await baseQuery(
        //   {
        //     url: '/auth/refresh-token',
        //     method: 'POST',
        //     body: { refreshToken },
        //   },
        //   api,
        //   extraOptions,
        // )
        // save new access token and refresh token
        // retry the initial query
        // if (refreshResult.data) {
        //   result = await baseQuery(args, api, extraOptions)
        // } else {
        //   // logout
        //   onLogout({ api })
        // }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseQueryApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'liked_users',
    'top_tags',
    'profile',
    'comments',
    'posts',
    'update-member',
    'related-tags',
    'notification',
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
});

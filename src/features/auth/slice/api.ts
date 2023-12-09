import { baseQueryApi as api } from '@/store/baseQueryApi';
import {
  GoogleLoginParams,
  LoginResponse,
  LoginSuccessResponse,
} from '../types';
import { LoginPayload } from '../types';

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginPayload>({
      async queryFn(
        { signature, address },
        _queryApi,
        _extraOptions,
        baseQuery,
      ) {
        try {
          await baseQuery({
            url: '/auth/local/register',
            method: 'POST',
            body: {
              publicAddress: address,
            },
          });
        } catch {}

        return await baseQuery({
          url: '/auth/signin',
          method: 'POST',
          body: {
            publicAddress: address,
            signedTxn: signature,
          },
        });
      },
    }),

    googleAuth: build.query<LoginSuccessResponse, GoogleLoginParams>({
      query: ({ id_token }: GoogleLoginParams) => ({
        url: `/auth/google/mobile-callback?id_token=${id_token}`,
      }),
    }),

    appleAuth: build.query<LoginSuccessResponse, GoogleLoginParams>({
      query: ({ id_token }: GoogleLoginParams) => ({
        url: `/auth/apple/mobile-callback?id_token=${id_token}`,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGoogleAuthQuery,
  useLazyAppleAuthQuery,
} = authApi;

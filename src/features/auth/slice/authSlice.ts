import { LoginResponse, UserInfo } from '../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from './api';
import { RootState } from '@/store/type';
import { profileApi } from '@/features/profile/slice/api';

export type SignInType = 'GOOGLE' | 'APPLE' | 'METAMASK' | 'TRUST_WALLET';

export interface AuthStates {
  userInfo: UserInfo | undefined | null;
  signInType: SignInType | null;
  accessToken: string | undefined | null;
  isNewUser?: boolean;
}

const initialState: AuthStates = {
  userInfo: undefined,
  signInType: null,
  accessToken: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthInfo: (
      state,
      actions: PayloadAction<
        Partial<Pick<AuthStates, 'accessToken' | 'userInfo'>> & {
          signInType?: SignInType | null;
        }
      >,
    ) => {
      state.accessToken = actions.payload.accessToken;
      state.userInfo = actions.payload.userInfo;
      if (actions.payload.signInType) {
        state.signInType = actions.payload.signInType;
      }
    },
    setSignInType: (state, actions: PayloadAction<SignInType>) => {
      state.signInType = actions.payload;
    },
    setNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.accessToken = action.payload.jwt;
          state.userInfo = action.payload.updatedUser;
        },
      )
      .addMatcher(
        profileApi.endpoints.registerProfile.matchFulfilled,
        (state, action) => {
          if (state.userInfo) {
            state.userInfo = {
              ...state.userInfo,
              profile: action.payload.profile,
            };
            state.isNewUser = true;
          }
        },
      );
  },
});

export const { setAuthInfo, setSignInType, setNewUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;

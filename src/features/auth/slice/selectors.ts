import { RootState } from '@/store/type';
import { createSelector } from '@reduxjs/toolkit';

export const getUserInfo = createSelector(
  (state: RootState) => state.auth.userInfo,
  userInfo => userInfo,
);

export const getAccessToken = createSelector(
  (state: RootState) => state.auth.accessToken,
  accessToken => accessToken,
);

export const getSignInType = createSelector(
  (state: RootState) => state.auth.signInType,
  signInType => signInType,
);

export const getIsNewUser = createSelector(
  (state: RootState) => state.auth.isNewUser,
  isNewUser => isNewUser,
);

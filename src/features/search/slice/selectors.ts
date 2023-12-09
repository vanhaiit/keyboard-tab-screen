import { RootState } from '@/store/type';
import { createSelector } from '@reduxjs/toolkit';

export const getSearchHistory = createSelector(
  (state: RootState) => state.search.searchHistory,
  searchHistory => searchHistory,
);

import { RootState } from '@/store/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchHistoryStates {
  searchHistory: string[];
}

const initialState: SearchHistoryStates = {
  searchHistory: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchHistory: (state, actions: PayloadAction<string>) => {
      const isExistedSearchValue = !!state.searchHistory.find(
        searchHistoryItem => searchHistoryItem === actions.payload,
      );

      if (isExistedSearchValue) {
        state.searchHistory = state.searchHistory.filter(
          item => item !== actions.payload,
        );
      }

      state.searchHistory = [actions.payload, ...state.searchHistory];
    },

    removeSearchHistory: (state, actions: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        item => item !== actions.payload,
      );
    },
  },
});

export const { setSearchHistory, removeSearchHistory } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
export const selectSearchHistory = (state: RootState) => state.auth.userInfo;

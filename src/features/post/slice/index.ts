import { RootState } from '@/store/type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Comment } from '../types/Post';

type PostSlice = {
  currentReplyToComment: Comment | null;
  currentEditingComment: Comment | null;
};

const initialState: PostSlice = {
  currentReplyToComment: null,
  currentEditingComment: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setReplyTo: (state, actions: PayloadAction<Comment | null>) => {
      state.currentReplyToComment = actions.payload;
      state.currentEditingComment = null;
    },
    setEditingComment: (state, actions: PayloadAction<Comment | null>) => {
      state.currentEditingComment = actions.payload;
      state.currentReplyToComment = null;
    },
  },
});

export const { setReplyTo, setEditingComment } = postSlice.actions;

export const postReducer = postSlice.reducer;
export const getCurrentReply = (state: RootState) =>
  state.post.currentReplyToComment;

export const getCurrentEditing = (state: RootState) =>
  state.post.currentEditingComment;

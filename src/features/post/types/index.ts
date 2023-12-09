import { UserProfile } from '@/features/profile/types';
import { CommonQueryParams } from '@/types';
import { IPoll } from '../components/Poll';
import { IPost } from './Post';

export interface GetMyPostParams extends CommonQueryParams {
  isPagination?: boolean;
  queryType?: MyFeedFilterTypes;
  userId?: string;
}

export interface GetMyFeedResponse {
  posts: IPost[];
  total: number;
  data: any[];
}

export interface UploadPayload {
  files: any;
}
export interface LikePostResponse {
  createdAt: string;
  id: string;
  post: IPost;
  profile: UserProfile;
  updatedAt: string;
}

export interface DeletePostResponse {
  profile: UserProfile;
}

export interface VotePollResponse {
  poll: IPoll;
  profile: UserProfile;
}

export enum MyFeedFilterTypes {
  Following = 'Following',
  Top = 'Top',
  User = 'User',
  Dao = 'Dao',
  Latest = 'Latest',
  Trending = 'Trending',
}
export enum DayOption {
  week = 7,
  month = 30,
}
export interface GetUserProfileParams extends CommonQueryParams {
  walletAddress?: string;
}

export interface ISheet {
  title?: string;
  key?: string;
  content: () => JSX.Element;
  description?: string;
  footer?: () => JSX.Element;
}

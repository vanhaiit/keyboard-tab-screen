import { IPost } from '@/features/post/types/Post';

export type ChartActionType =
  | 'post'
  | 'upvote'
  | 'comment'
  | 'referral-accept'
  | 'referral'
  | 'other';
export interface ChartData {
  actionType: ChartActionType;
  count: number;
  date: string;
  value: number;
}

export interface EarnActions {
  actionType: ChartActionType;
  date: string;
  reward: string;
  post?: IPost;
}
export interface EarnSummary {
  count: number;
  type: ChartActionType;
  totalReward: number;
}

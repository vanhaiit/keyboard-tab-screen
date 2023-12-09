import { UserProfile } from '@/features/profile/types';

export interface Tag {
  content: string;
  id: string;
  totalFollowers: number;
  totalPosts: number;
}

export interface FollowData {
  id: string;
  isFollowing: boolean;
  follow: UserProfile;
  follower: UserProfile;
}

export interface TagData {
  id: string;
  isFollowing: boolean;
  tag: Tag;
}

export interface DAO {
  name: string;
  id: string;
  totalFollowers: number;
  totalPosts: number;
  avatar: {
    url: string;
  };
}

export interface DAOData {
  id: string;
  addToFeed: boolean;
  dao: DAO;
  isFirstVisit: boolean;
  isFollowing: boolean;
  profile: UserProfile;
  referral_status: string;
  role: string;
  status: string;
}

export interface ParamsQuery {
  _sort?: string;
  _limit?: number;
  _start?: number;
  follow?: string;
  follower?: string;
  profile?: string;
  unique_id?: string;
}

export interface PayLoadTag {
  tag: string;
}

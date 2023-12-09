export interface ISearchTags {
  createdAt: string;
  content: string;
  totalFollowers: number;
  totalPosts: number;
  _id: string;
  isFollowing: boolean;
}

export interface ISearchUsers {
  id: number;
  totalFollowers: number;
  totalPosts: number;
  totalFollowings: number;
  username: string;
  unique_id: string;
  defaultAvatarIndex: number;
  avatar: {
    url: string;
  };
}

export enum SearchDataType {
  RECENT = 'recent',
  TRENDING = 'trending',
  POST = 'post',
}

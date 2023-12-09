import { UserProfile } from '@/features/profile/types';
import { IPoll } from '../components/Poll';
import { CommonQueryParams } from '@/types';
import { DAO } from '@/features/dao/types';

export type PostContentType = 'text' | 'image' | 'video' | 'link';

export interface Category {
  customId: string;
  id: string;
  name: string;
}

interface Tags {
  content: string;
  createdAt: string;
  id: string;
  totalFollowers: number;
  totalPosts: number;
  updatedAt: string;
}

interface Format {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  url: string;
  width: number;
}

export interface Media {
  createdAt: string;
  ext: string;
  formats: {
    medium: Format;
    small: Format;
    thumbnail: Format;
  };
  hash: string;
  height: number;
  id: string;
  mime: string;
  name: string;
  provider: string;
  related: string[];
  size: number;
  updatedAt: string;
  url: string;
  width: number;
}

interface PostData {
  content: {
    htmlContent?: string;
    rawContent?: string;
    type: PostContentType;
    files?: string[];
    link?: string;
  }[];
}

export interface Location {
  mainText: string;
  placeId: string;
  secondaryText: string;
}

export interface Comment {
  status: string;
  _id: string;
  content: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  owner: UserProfile;
  post: string;
  totalReply?: number;
  id: string;
  replyTo?: Comment;
}

export interface IPost {
  commentCount: number;
  comments: Comment[];
  createdAt: string;
  data: PostData;
  id: string;
  isBlind: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  isLike: boolean;
  isDislike: boolean;
  dislikeCount: number;
  isReported: boolean;
  keywords: string;
  language: string;
  likeCount: number;
  location: Location | null;
  mapLocation: Media | null;
  medias: Media[];
  profile: UserProfile;
  publicAt: string;
  reviewCategories: Category[];
  reviewRating: number;
  score: number;
  shareCount: number;
  status: string;
  tags: Tags[];
  title: string;
  topScore: number;
  total: number;
  type: string;
  updatedAt: string;
  views: number;
  poll?: IPoll;
  yourVote?: {
    voteOption: number;
  };
  rePost?: IPost;
  dao?: DAO;
}
export interface PayloadCreatePost {
  id?: string;
  title: string;
  medias: string[];
  data: Data;
  tags: any[];
  status: string;
  mapLocation?: null;
  location?: null;
  type: string;
  reviewCategories?: string[];
  reviewRating?: number;
  poll?: IPoll;
  daoId?: string | number;
  daoMenu?: string | number;
}

export interface Data {
  content: Content[];
}

export interface Content {
  type: string;
  htmlContent?: string;
  rawContent?: string;
  files?: Array<string[]>;
}

export type PostQueryParams = CommonQueryParams & {
  post: string;
};

export type CreateCommentRequest = {
  post: IPost;
  content: string;
  mentionUsers?: string[];
  replyTo?: string;
  shortPlainContent: string;
};

import { UserProfile } from '@/features/profile/types';
import { Profile } from '@/features/auth/types';
import { IPost, Media } from '@/features/post/types/Post';
import { CommonQueryParams } from '@/types';

export interface DAO {
  totalPosts: number;
  totalFollowers: number;
  invitation: boolean;
  deleted: boolean;
  categories: Category[];
  pinned_posts: IPost[];
  classification: string;
  rule: FAQ;
  faq: FAQ;
  menu: FAQ;
  region: string;
  snsLink: FAQ;
  description: string;
  walletAddress: string;
  ownerAccount: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  id: string;
  isFollowing: boolean;
  avatar: Media;
}

export interface Category {
  name: string;
  customId: string;
  createdAt: string;
  updatedAt: string;
  icon: IconDao;
  id: string;
}

export interface IconDao {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  url: string;
  provider: string;
  related: null[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface FAQ {
  list: IList[];
}

export interface IList {
  title: string;
  detail: string;
}

export interface DAOCategory {
  _id: string;
  name: string;
  customId: string;
  createdAt: string;
  updatedAt: string;
  icon: IconDao;
  id: string;
}

export interface IconDao {
  _id: string;
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  url: string;
  provider: string;
  related: null[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ICreateDAO {
  name?: string;
  username?: string;
  representativeLink?: string;
  walletAddress?: string;
  description?: string;
  snsLink?: string[];
  categories?: string[];
  region?: string;
  menu?: Menu[];
  classification?: string;
  rule?: RULE[];
  faq?: CREATE_FAQ[];
  avatar?: string | any;
  contributors?: string[];
}

export interface IUpdateDAO {
  invitation?: boolean;
  id?: string;
  prefix: string;
  type?: string;
  profile?: string;
  role?: string;
}

export interface ICreateDAOState extends ICreateDAO {
  sns?: Array<{ id: number; value?: string }>;
  ctr?: Array<{ id: number; value?: string; userInfo?: Profile }>;
  tags?: string[];
  menus?: Array<Menu>;
  rules?: Array<{ id: number } & RULE>;
  faqs?: Array<{ id: number } & CREATE_FAQ>;
  media?: any;
  profile?: any;
  region?: string;
}

export interface CREATE_FAQ {
  title?: string;
  detail?: string;
}

export interface RULE {
  title?: string;
  detail?: string;
}

export interface Menu {
  id?: number | string;
  menuInput?: string;
  title?: string;
}

export interface PayloadCheckDuplicateDAONameParams {
  name: string;
}

export interface IDAODetail {
  totalPosts: number;
  totalFollowers: number;
  invitation: boolean;
  deleted: boolean;
  categories: Category[];
  pinned_posts: any[];
  _id: string;
  classification: string;
  rule: FAQ;
  faq: FAQ;
  menu: FAQ;
  region: string;
  snsLink: { list: string[] };
  description: string;
  walletAddress: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar: Avatar;
  profile: Profile;
  id: string;
  contributors: any[];
}

export interface Avatar {
  _id: string;
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  url: string;
  formats: Formats;
  provider: string;
  related: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Formats {
  thumbnail: Large;
  large: Large;
  medium: Large;
  small: Large;
}

export interface Large {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: null;
  url: string;
}

export interface IGetPostDAOQueryParams {
  id: string;
  payload: CommonQueryParams;
  _start: number;
}

export enum TimeInvitation {
  NO_LIMIT = 'NO_LIMIT',
  '1_HOUR' = '1_HOUR',
  '1_DAY' = '1_DAY',
  '1_WEEK' = '1_WEEK',
}

export interface IInviteParams {
  _sort?: string;
  _limit?: number;
  _start?: number;
  id?: string;
  unique_id_contains?: string;
}

export interface IGenerateLink {
  id?: string;
  expiredTime?: string;
  name?: string;
}

export interface IUserInvite {
  code: number;
  data: UserProfile[];
  total: number;
}
export interface IUserDAO {
  addToFeed: boolean;
  status: string;
  confirmed: boolean;
  isFirstVisit: boolean;
  referral_status: string;
  _id: string;
  role: RoleDao;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dao: any;
  profile: Profile;
  id: string;
}

export interface IReports {
  _id: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  dao: string;
  post: string;
  reporter: string;
  id: string;
}

export enum StatusUserDao {
  PENDING = 'pending',
  PUBLIC = 'public',
  BLOCKED = 'blocked',
  NONE = 'none',
}

export enum RoleDao {
  CONTRIBUTOR = 'contributor',
  USER = 'user',
  ADMIN = 'admin',
}

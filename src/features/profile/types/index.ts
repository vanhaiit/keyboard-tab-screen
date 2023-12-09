import { StatusUserDao } from '@/features/dao/types';
import { IPost } from '@/features/post/types/Post';
import { Dayjs } from 'dayjs';

export interface DAO {
  totalPosts: number;
  totalFollowers: number;
  invitation: boolean;
  deleted: boolean;
  categories: Category[];
  pinned_posts: any[];
  _id: string;
  classification: string;
  rule: Rule;
  faq: Faq;
  menu: Menu;
  region: string;
  snsLink: SnsLink;
  description: string;
  walletAddress: any;
  ownerAccount: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profile: UserProfile;
  id: string;
  avatar?: Avatar;
}

export interface DAOUser {
  addToFeed: boolean;
  status: string;
  isFirstVisit: boolean;
  referral_status: string;
  _id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dao: DAO;
  profile: UserProfile;
  id: string;
}

export interface Category {
  _id: string;
  name: string;
  customId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  icon: Icon;
  id: string;
}

export interface Icon {
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
  related: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Rule {
  list: any[];
}

export interface Faq {
  list: any[];
}

export interface Menu {
  list: any[];
}

export interface SnsLink {
  list: any[];
}

export interface TopLink {
  views: number;
  _id: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  post: IPost;
  profile: UserProfile;
  id: string;
  dao?: DAO;
}

export interface TopTag {
  totalPosts: number;
  totalFollowers: number;
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  isFollowing: boolean;
}

export interface UserProfile {
  totalPosts: number;
  totalFollowers: number;
  totalFollowings: number;
  totalTagFollowings: number;
  totalDaoFollowings: number;
  referralCount: number;
  referral_status: any;
  badges: Badge[];
  popo_avatars: PopoAvatar[];
  decorated_popos: any[];
  _id: string;
  unique_id: string;
  walletAddress?: string;
  defaultAvatarIndex: number;
  username: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  users_permissions_user?: UsersPermissionsUser;
  investor: Investor;
  coverImage?: CoverImage;
  yourselfDescription?: string;
  timeZone?: string;
  avatar?: Avatar;
  active_decorated_popo?: ActiveDecoratedPopo;
  discordUser?: DiscordUser;
  id: string;
  isFollowing: boolean;
  email?: string;
  google_user?: GoogleUser;
  reward?: number;
  status?: string | StatusUserDao;
  totalFollow?: number;
}

export interface Badge {
  _id: string;
  name: string;
  customId: string;
  id: string;
}

export interface PopoAvatar {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar: Avatar;
  body: string;
  id: string;
  face_accessory?: string;
  hair_accessory?: string;
  top?: string;
  background_accessory?: string;
  bottom?: string;
  prop_accessory?: string;
  shoe?: string;
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
  thumbnail: Thumbnail;
}

export interface Thumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: any;
  url: string;
}

export interface UsersPermissionsUser {
  confirmed: boolean;
  blocked: boolean;
  _id: string;
  username: string;
  provider: string;
  nonce: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role: string;
  profile: string;
  id: string;
}

export interface Investor {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profile: string;
  id: string;
}

export interface CoverImage {
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

export interface ActiveDecoratedPopo {
  status: string;
  wearable_nfts: any[];
  _id: string;
  data: Data;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bottom: any;
  hair_accessory: any;
  popo_nft: string;
  profile: string;
  prop_accessory: any;
  top: any;
  id: string;
}

export interface Data {
  body: Body;
  shoe: Shoe;
  background_accessory: BackgroundAccessory;
  top: any;
  bottom: any;
  hair_accessory: any;
  prop_accessory: any;
}

export interface Body {
  _id: string;
  type: string;
  value: string;
  unique_name: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: Image;
  id: string;
}

export interface Image {
  _id: string;
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  provider: string;
  width: any;
  height: any;
  related: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Shoe {
  _id: string;
  type: string;
  value: string;
  unique_name: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: Image;
  id: string;
}

export interface BackgroundAccessory {
  _id: string;
  type: string;
  value: string;
  unique_name: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: Image;
  id: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: any;
  avatar: any;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: any;
  banner_color: any;
  accent_color: any;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  avatar_decoration: any;
  email: string;
  verified: boolean;
  has_bounced_email?: boolean;
}

export interface GoogleUser {
  confirmed: boolean;
  blocked: boolean;
  _id: string;
  username: string;
  email: string;
  provider: string;
  nonce: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role: string;
  profile: string;
  id: string;
}

export type CountFollowingParams = {
  follower: string;
  follow: string;
};

export type UpdateProfilePayload = {
  coverImage?: string;
  id: string;
  username?: string;
  accountName?: string;
  yourselfDescription?: string;
};

export type RegisterRequestPayload = {
  email?: string;
  userName: string;
  walletJwt?: string;
};

export type LikedPost = {
  id: string;
  profile: string;
  post: IPost;
};

export type BookMarkedPost = {
  id: string;
  owner: string;
  post: IPost;
  daoPost: string;
};

export enum ActivityScreen {
  POST = 'POST',
  COMMENTS = 'COMMENTS',
  LIKES = 'LIKES',
  BOOKMARK = 'BOOKMARK',
  DRAFTS = 'DRAFTS',
  INVITE = 'INVITE',
}

export interface GetPostUserParams {
  _sort?: string;
  _limit: number;
  _start: number;
  profile?: string;
  status?: string;
  owner?: string;
  unique_id?: string;
}

export enum InviteStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface InviteDao {
  name: string;
  avatar: {
    url: string;
  };
}
export interface InviteData {
  id: string;
  status: InviteStatus;
  time: string | Dayjs;
  dao: InviteDao;
  receiver: UserProfile;
  sender: UserProfile;
}
export interface InviteDataResponse {
  code: number;
  total: number;
  data: InviteData[];
}

export interface IFetchComments {
  content: string;
  dao: string;
  id: string;
  language: string;
  owner: UserProfile;
  post: IPost;
  replyTo: string;
  status: string;
  createdAt: string;
}

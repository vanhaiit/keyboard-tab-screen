export interface LoginSuccessResponse {
  jwt: string;
  user: UserInfo;
  updatedUser?: UserInfo;
}

export interface UserInfo {
  blocked: boolean;
  confirmed: boolean;
  id: string;
  nonce: number;
  role: { id: string; name: string };
  description: string;
  provider: string;
  name: string;
  type: string;
  username: string;
  email?: string;
  profile?: Profile;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  type: string;
  __v: number;
  id: string;
}

export interface Profile {
  id: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowings: number;
  totalTagFollowings: number;
  totalDaoFollowings: number;
  referralCount: number;
  referral_status: any;
  badges: any[];
  popo_avatars: string[];
  decorated_popos: any[];
  _id: string;
  unique_id: string;
  walletAddress: string;
  defaultAvatarIndex: number;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  google_user: string;
  investor: string;
  avatar: Avatar;
  users_permissions_user: string;
}

export interface Avatar {
  id: string;
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
export interface GoogleLoginParams {
  id_token: string;
}

export interface LoginPayload {
  signature?: string;
  address?: string;
}

export interface LoginResponse {
  jwt: string;
  updatedUser: UserInfo;
}

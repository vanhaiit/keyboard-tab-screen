import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { IPost } from '@/features/post/types/Post';
import { GooglePlaceData } from 'react-native-google-places-autocomplete';
import { IDAODetail, IList } from '@/features/dao/types';
import { IPoll } from '@/features/post/components/Poll';

export type TagLocation = {
  placeImageUri: string;
  data: GooglePlaceData;
};

export type AppStackParams = {
  Tab: undefined;
  CreatePost:
    | undefined
    | { location?: TagLocation; data?: IPoll | any; post?: IPost };
  Locations: undefined;
  ProfileDetail: undefined | { profileId?: string; uniqueId?: string };
  AccountSetting: undefined;
  Following: { profileId: string; tab?: number };
  Activities: { profileId: string };
  ActiveActivity: { profileId: string; active: string };
  PostDetails: { post?: IPost; postId?: string };
  DetailDAO: { id: string };
  CreateDAO: { detail?: IDAODetail };
  InviteDAO: { id: string };
  Notification: undefined;
  LeaderBoard: undefined;
  UserToFollow: undefined;
  DaoToJoin: undefined;
  Search: { searchContent?: string };
  SearchDetail: { searchContent: string };
  Rule: { data: IList[] };
  FAQ: { data: IList[] };
  MembersRequest: { id: string };
  ReportedPosts: { id: string };
  Members: { id: string };
  Settings: undefined;
  Nft: { uniqueId: string };
  RewardDetail: undefined;
  GetMoreReward: undefined;
};

export type AppTabParams = {
  Dashboard: undefined;
  Earn: undefined;
  NftTab: undefined;
  Profile: undefined;
  Actions: undefined;
};

export type AppRootParams = AppStackParams & AppTabParams;

export type AppStackScreen<RouteName extends keyof AppStackParams> = React.FC<
  NativeStackScreenProps<AppRootParams, RouteName>
>;

export type RootStackScreenProps<T extends keyof AppStackParams> =
  NativeStackScreenProps<AppStackParams, T>;

export type RootStackNavigationProps<T extends keyof AppStackParams> =
  NativeStackNavigationProp<AppStackParams, T>;

export type RootStackRouteProps<T extends keyof AppStackParams> = RouteProp<
  AppStackParams,
  T
>;

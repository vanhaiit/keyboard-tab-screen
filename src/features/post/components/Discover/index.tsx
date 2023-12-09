import { FilterTypes } from '@/features/Leaderboard/types';
import { UserProfile } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  useGetDaoToJoinQuery,
  useGetLeadersEarnQuery,
  useGetPostsQuery,
  useGetUserToFollowQuery,
} from '../../slice/api';
import { IPost } from '../../types/Post';
import Trending from '../Review/Trending';
import DaoToJoin from './DaoToJoin';
import LeaderBoard from './LeaderBoard';
import UserToFollow from './UserToFollow';
import { DAO } from '@/features/dao/types';

const Container = styled(View)(({ theme: { space } }) => ({
  flex: 1,
  marginTop: space[1],
}));

enum DataTypes {
  Leaders = 'LeaderBoard',
  TopPosts = 'TopPosts',
  ReviewPosts = 'ReviewPosts',
  DaoToJoin = 'DaoToJoin',
  UserToFollow = 'UserToFollow',
}

interface Props {
  bottomSheetOpen: boolean;
  onTabChange?: (val: number) => void;
  onCloseBottomSheet: () => void;
}

const Discover = ({ onTabChange }: Props) => {
  const { space } = useTheme();
  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Dashboard'>>();
  const { data: topPosts, isLoading: topPostsLoading } = useGetPostsQuery({
    _limit: 4,
    _start: 0,
    _sort: 'topScore:desc',
    type: 'everyone',
  });

  const { data: reviewPosts, isLoading: reviewPostsLoading } = useGetPostsQuery(
    {
      _limit: 4,
      _start: 0,
      _sort: 'score:desc',
      type: 'review',
    },
  );

  const { data: leaders, isLoading: leadersLoading } = useGetLeadersEarnQuery({
    _limit: 6,
    _start: 0,
    timeFilter: FilterTypes.Week,
  });
  const { data: UserToFollows, isLoading: userToFollowLoading } =
    useGetUserToFollowQuery({
      page: 1,
      pageSize: 6,
    });

  const { data: daosToJoin, isLoading: getDaoToJoinLoading } =
    useGetDaoToJoinQuery({
      _limit: 4,
      _start: 0,
    });

  const loading = useMemo(() => {
    return (
      topPostsLoading ||
      reviewPostsLoading ||
      getDaoToJoinLoading ||
      userToFollowLoading ||
      leadersLoading
    );
  }, [
    topPostsLoading,
    reviewPostsLoading,
    getDaoToJoinLoading,
    userToFollowLoading,
    leadersLoading,
  ]);

  const containerStyles = useMemo(
    () => ({
      paddingBottom: space[6],
    }),
    [space],
  );

  const renderItem = useCallback(
    ({
      item: { type, posts, daos, users },
    }: {
      item: {
        type: DataTypes;
        posts?: IPost[];
        daos?: DAO[];
        users?: UserProfile[];
      };
    }) => {
      if (type === DataTypes.Leaders) {
        return <LeaderBoard data={users || []} />;
      } else if (type === DataTypes.TopPosts) {
        return (
          <Trending data={posts || []} loading={loading} title="Top post" />
        );
      } else if (type === DataTypes.ReviewPosts) {
        return (
          <Trending
            onSeeMore={() => {
              onTabChange && onTabChange(2);
            }}
            data={posts || []}
            loading={loading}
            title="Review to read"
          />
        );
      } else if (type === DataTypes.DaoToJoin) {
        return (
          <DaoToJoin
            onSeeMore={() => navigate('DaoToJoin')}
            data={daos || []}
            loading={loading}
          />
        );
      } else if (type === DataTypes.UserToFollow) {
        return (
          <UserToFollow
            onSeeMore={() => navigate('UserToFollow')}
            data={users || []}
            loading={loading}
          />
        );
      }
      return <></>;
    },
    [loading, navigate, onTabChange],
  );

  const keyExtractor = useCallback(
    (_: any, index: number) => index.toString(),
    [],
  );

  return (
    <Container>
      <FlashList
        contentContainerStyle={containerStyles}
        estimatedItemSize={200}
        data={
          [
            {
              type: DataTypes.Leaders,
              users: leaders,
            },
            {
              type: DataTypes.TopPosts,
              posts: topPosts,
            },
            {
              type: DataTypes.UserToFollow,
              posts: [],
              daos: [],
              users: UserToFollows,
            },
            {
              type: DataTypes.DaoToJoin,
              posts: [],
              daos: daosToJoin,
            },
            {
              type: DataTypes.ReviewPosts,
              posts: reviewPosts,
            },
          ] as any
        }
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default Discover;

import { Icons } from '@/assets';
import Avatar from '@/components/Avatar';
import { H5, Label } from '@/components/Typography';

import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import Config from 'react-native-config';

import Empty from '@/components/Empty';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { ActivityScreen } from '@/features/profile/types';
import { AppStackParams } from '@/navigations/types';
import { theme } from '@/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import {
  useGetNotificationQuery,
  useReadAllNotificationMutation,
  useRemoveNotificationMutation,
} from '../slice/api';
import {
  INotification,
  TypeNotification,
  TypeRoleNotification,
} from '../types';

// const FILTER_LIST = ['All', 'Community', 'Market', 'IDO'];
const PAGE_LIMIT = 10;
const SORT_DIRECTION = 'createdAt:desc';
const POLLING_INTERVAL = 5000;

const Notification = () => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  // const [currentFilter, setCurrentFilter] = useState(FILTER_LIST[0]);
  const [isLoadedFlashList, setIsLoadedFlashList] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AppStackParams>>();
  const [
    removeNotification,
    { isLoading: isRemoving, isSuccess: isRemoveSuccess },
  ] = useRemoveNotificationMutation();

  const [readAllNotification] = useReadAllNotificationMutation();

  const {
    combinedData: notificationList,
    loadMore,
    refresh,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetNotificationQuery,
    params: {
      _sort: SORT_DIRECTION,
      _limit: PAGE_LIMIT,
    },
    pollingInterval: POLLING_INTERVAL,
  });

  const onFlashListLoaded = () => {
    setIsLoadedFlashList(true);
  };

  const renderLoadingIcon = () => {
    if (isFetching) {
      return <Loading />;
    }
    return <></>;
  };

  const renderFilterList = () => {
    return <></>;
    // return (
    //   <FilterList>
    //     {FILTER_LIST.map((filterLabel, i) => {
    //       const isActive = currentFilter === filterLabel;

    //       return (
    //         <FilterItemPressable
    //           key={i}
    //           onPress={() => {
    //             setCurrentFilter(filterLabel);
    //           }}>
    //           <FilterItem isActive={isActive}>{filterLabel}</FilterItem>
    //           <FilterItemLine isActive={isActive} />
    //         </FilterItemPressable>
    //       );
    //     })}
    //   </FilterList>
    // );
  };

  const renderNotificationItem = (item: INotification) => {
    const accFrom = get(item, 'from.username', '');
    const typeNoti = get(item, 'data.type', '');
    const createdTime = get(item, 'createdAt', '');

    const avatarDefaultIndex = get(item, 'from.defaultAvatarIndex', 0);
    const avatarDefaultUrl = `${Config.BASE_URL}/uploads/profile-avatars/profile-avatar-${avatarDefaultIndex}.png`;
    const avatarUrlResponse = get(item, 'from.avatar.url', '');
    const avatarUrl = avatarUrlResponse ? avatarUrlResponse : avatarDefaultUrl;

    //hide notification
    if (typeNoti === TypeNotification.DIS_LIKE) {
      return <></>;
    }

    const renderAvatar = () => {
      const renderMiniTagIcon = () => {
        const defaultWidth = 14;
        const defaultHeight = 14;
        const defaultColor = colors.black[4];

        switch (typeNoti) {
          case TypeNotification.MENTION:
            return (
              <MiniTagIconBackground>
                <Icons.MentionIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.COMMENT:
            return (
              <MiniTagIconBackground>
                <Icons.CommentBlackIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.LIKE:
            return (
              <MiniTagIconBackground>
                <Icons.HeartIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.DAO_MEMBERSHIP_APPROVED:
            return (
              <MiniTagIconBackground>
                <Icons.Checked
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.DAO_MEMBERSHIP_REJECTED:
            return (
              <MiniTagIconBackground>
                <Icons.RejectIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.INVITATION:
            return (
              <MiniTagIconBackground>
                <Icons.UserMultiIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.REQUEST_JOIN_DAO:
            return (
              <MiniTagIconBackground>
                <Icons.UserPlusIcon
                  width={defaultWidth}
                  height={defaultHeight}
                  color={defaultColor}
                />
              </MiniTagIconBackground>
            );
          case TypeNotification.UPDATE_MEMBER_ROLE: {
            const roleType = get(item, 'data.role', '');
            switch (roleType) {
              case TypeRoleNotification.CONTRIBUTOR:
                return (
                  <MiniTagIconBackground>
                    <Icons.UserTickIcon
                      width={defaultWidth}
                      height={defaultHeight}
                      color={defaultColor}
                    />
                  </MiniTagIconBackground>
                );
              case TypeRoleNotification.USER:
                return (
                  <MiniTagIconBackground>
                    <Icons.UserIcon
                      width={defaultWidth}
                      height={defaultHeight}
                      color={defaultColor}
                    />
                  </MiniTagIconBackground>
                );
            }
          }
          default:
            return '';
        }
      };

      return (
        <AvatarUser
          url={avatarUrl}
          size={30}
          miniTagIcon={renderMiniTagIcon()}
        />
      );
    };

    const renderAccFrom = () => {
      switch (typeNoti) {
        case TypeNotification.INVITATION:
        case TypeNotification.UPDATE_MEMBER_ROLE:
        case TypeNotification.DAO_MEMBERSHIP_APPROVED:
        case TypeNotification.DAO_MEMBERSHIP_REJECTED:
          return '';

        default:
          return (
            <ContentMainHighLight style={{ fontWeight: '700' }}>
              {accFrom}{' '}
            </ContentMainHighLight>
          );
      }
    };

    const renderNotificationContent = () => {
      switch (typeNoti) {
        case TypeNotification.MENTION:
          return 'mentioned you in post';
        case TypeNotification.COMMENT:
          return 'comment to your post';
        case TypeNotification.LIKE:
          return 'like your post';
        case TypeNotification.DAO_MEMBERSHIP_APPROVED: {
          const daoName = get(item, 'data.dao.name', '');
          return `${daoName} membership has been approved`;
        }
        case TypeNotification.DAO_MEMBERSHIP_REJECTED:
          const daoName = get(item, 'data.dao.name', '');
          return `${daoName} membership has been rejected`;
        case TypeNotification.INVITATION: {
          const daoName = get(item, 'data.dao.name', '');
          return `You are invited to ${daoName}`;
        }
        case TypeNotification.USER_FOLLOW:
          return 'follow you';
        case TypeNotification.REQUEST_JOIN_DAO: {
          const daoName = get(item, 'data.dao.name', '');
          return `request to join ${daoName}`;
        }
        case TypeNotification.UPDATE_MEMBER_ROLE: {
          const roleType = get(item, 'data.role', '');
          const daoName = get(item, 'data.dao.name', '');
          switch (roleType) {
            case TypeRoleNotification.CONTRIBUTOR:
              return `You have been designated ${daoName} contributor`;
            case TypeRoleNotification.USER:
              return `You have been designated ${daoName} user`;
          }
        }
        default:
          return '';
      }
    };

    const renderCreatedTime = () => {
      return dayjs(createdTime).fromNow();
    };

    const renderRemoveIcon = () => {
      const handlePressRemove = () => {
        removeNotification({ notificationId: item.id });

        if (isRemoveSuccess) {
        }
      };

      return (
        <PressableCloseIcon
          onPress={handlePressRemove}
          disabled={isRemoving}
          hitSlop={10}>
          <CloseIconBackground>
            <Icons.Close width={8} height={8} color={theme.colors.black[2]} />
          </CloseIconBackground>
        </PressableCloseIcon>
      );
    };

    const onPressNotificationItem = () => {
      switch (typeNoti) {
        case TypeNotification.MENTION: {
          const postId = get(item, 'data.mention.post.id', '');
          navigate('PostDetails', { postId });
          return;
        }
        case TypeNotification.LIKE: {
          const postId = get(item, 'data.like.post.id', '');
          navigate('PostDetails', { postId });
          return;
        }
        case TypeNotification.COMMENT: {
          const postId = get(item, 'data.comment.post.id', '');
          navigate('PostDetails', { postId });
          return;
        }
        case TypeNotification.DAO_MEMBERSHIP_APPROVED:
        case TypeNotification.DAO_MEMBERSHIP_REJECTED: {
          const daoId = get(item, 'data.dao.id', '');
          navigate('DetailDAO', { id: daoId });
          return;
        }
        case TypeNotification.UPDATE_MEMBER_ROLE: {
          const daoId = get(item, 'data.dao.id', '');
          navigate('Members', { id: daoId });
          return;
        }
        case TypeNotification.INVITATION: {
          const profileId = get(item, 'data.profile.id', '');
          navigate('ActiveActivity', {
            profileId,
            active: ActivityScreen.INVITE,
          });
          return;
        }
        default:
          return;
      }
    };

    return (
      <TouchableOpacity onPress={onPressNotificationItem}>
        <NotificationItem>
          <NotificationContentLeft>
            {renderAvatar()}
            <NotificationContent>
              <ContentMain>
                {renderAccFrom()}
                {renderNotificationContent()}
              </ContentMain>
              <ContentTime fontWeight="medium">
                {renderCreatedTime()}
              </ContentTime>
            </NotificationContent>
          </NotificationContentLeft>
          {renderRemoveIcon()}
        </NotificationItem>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const handleResetDataNotification = () => {
      dispatch(baseQueryApi.util.resetApiState());
      refresh();
    };

    if (isRemoveSuccess) {
      handleResetDataNotification();
    }
  }, [dispatch, isRemoveSuccess, refresh]);

  useEffect(() => {
    readAllNotification(undefined);
  }, []);

  const renderNotification = () => {
    if (!isLoading && !isFetching && notificationList.length <= 0) {
      return <Empty />;
    }

    return (
      <>
        {!isLoadedFlashList && renderLoadingIcon()}

        <FlashList
          onLoad={onFlashListLoaded}
          showsVerticalScrollIndicator={false}
          data={notificationList as INotification[]}
          keyExtractor={(item: INotification, index) =>
            item.id.toString() + index
          }
          renderItem={({ item }) => {
            return renderNotificationItem(item);
          }}
          estimatedItemSize={120}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderLoadingIcon()}
        />
      </>
    );
  };

  return (
    <Container>
      <Header title="Notification" />

      {renderFilterList()}

      <AlertText>
        Alerts are automatically deleted after{' '}
        <HighlightAlertText> 7 days</HighlightAlertText>
      </AlertText>

      <NotificationList>{renderNotification()}</NotificationList>
    </Container>
  );
};

export default Notification;

const PressableCloseIcon = styled.Pressable(() => ({}));

const CloseIconBackground = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.grey[1],
  borderRadius: theme.borderRadius.full,
  width: 14,
  height: 14,
  justifyContent: 'center',
  alignItems: 'center',
}));

const MiniTagIconBackground = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.lightGreen,
  borderRadius: theme.borderRadius.full,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const ContentTime = styled(Label)(({ theme }) => ({
  color: theme.colors.grey[1],
  marginTop: theme.space[1],
}));

const ContentMain = styled(H5)(({ theme }) => ({
  color: theme.colors.white,
  width: '100%',
}));

const ContentMainHighLight = styled(ContentMain)(() => ({
  // fontWeight: '700',
}));

const NotificationContent = styled.View(({ theme }) => ({
  marginLeft: theme.space[2],
  justifyContent: 'center',
  flex: 1,
}));

const AvatarUser = styled(Avatar)(({ theme }) => ({
  borderRadius: theme.borderRadius.full,
}));

const NotificationContentLeft = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
}));

const NotificationItem = styled.View(({ theme }) => ({
  paddingHorizontal: theme.horizontalSpace[4],
  paddingVertical: theme.space[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.colors.black[2],
  borderRadius: theme.borderRadius.medium,
  marginBottom: theme.space[2],
  // gap: 10,
}));

const NotificationList = styled.View(
  ({ theme: { horizontalSpace, space } }) => ({
    flex: 1,
    paddingHorizontal: horizontalSpace[4],
    paddingBottom: space[4],
  }),
);

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
  flex: 1,
}));

const AlertText = styled(H5)(({ theme }) => ({
  color: theme.colors.grey[1],
  textAlign: 'center',
  marginTop: theme.horizontalSpace[4],
  marginBottom: theme.horizontalSpace[2],
}));

const HighlightAlertText = styled(H5)(({ theme }) => ({
  color: theme.colors.lightGreen,
}));

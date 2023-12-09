import { H4, Label } from '@/components/Typography';
import { ISearchUsers } from '@/features/search/types';
import { AppStackParams } from '@/navigations/types';
import styled from '@emotion/native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';

interface Props {
  data: ISearchUsers;
}

const UserCard: React.FC<Props> = ({
  data: {
    avatar,
    defaultAvatarIndex,
    totalFollowers,
    totalFollowings,
    totalPosts,
    unique_id,
    username,
    id,
  },
}) => {
  const { navigate } = useNavigation<NavigationProp<AppStackParams, 'Tab'>>();

  const renderSourceAvatarUrl = () =>
    avatar
      ? avatar?.url
      : `${Config.BASE_URL}/uploads/profile-avatars/profile-avatar-${defaultAvatarIndex}.png`;

  const handlePressUserCard = () => {
    navigate('ProfileDetail', { profileId: id.toString() });
  };

  return (
    <UserCardContainer onPress={handlePressUserCard}>
      <TopContent>
        <UserAvatar
          source={{ uri: renderSourceAvatarUrl() }}
          resizeMode="contain"
        />
        <TopRightContent>
          <UserName fontWeight="bold">{username}</UserName>
          <UserAccount>@{unique_id}</UserAccount>
        </TopRightContent>
      </TopContent>
      <BottomContent>
        <BottomContentItem>
          <BottomContentValue fontWeight="bold">
            {totalPosts}
          </BottomContentValue>
          <BottomContentLabel>Post</BottomContentLabel>
        </BottomContentItem>
        <BottomContentItem>
          <BottomContentValue fontWeight="bold">
            {totalFollowers}
          </BottomContentValue>
          <BottomContentLabel>Follower</BottomContentLabel>
        </BottomContentItem>
        <BottomContentItem>
          <BottomContentValue fontWeight="bold">
            {totalFollowings}
          </BottomContentValue>
          <BottomContentLabel>Following</BottomContentLabel>
        </BottomContentItem>
      </BottomContent>
    </UserCardContainer>
  );
};

export default UserCard;

const BottomContentValue = styled(Label)(({ theme }) => ({
  color: theme.colors.lightGreen,
}));

const BottomContentLabel = styled(Label)(({ theme }) => ({
  color: theme.colors.grey[1],
  marginLeft: theme.space[2],
}));

const BottomContentItem = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginRight: theme.space[6],
}));

const UserAccount = styled(Label)(({ theme }) => ({
  color: theme.colors.grey[1],
  marginTop: theme.space[1],
}));

const UserName = styled(H4)(({ theme }) => ({
  color: theme.colors.white,
}));

const TopRightContent = styled.View(({ theme }) => ({
  marginLeft: theme.space[2],
}));

const UserAvatar = styled(FastImage)(({ theme }) => ({
  borderRadius: theme.borderRadius.full,
  height: theme.space[10],
  width: theme.space[10],
}));

const BottomContent = styled.View(({ theme }) => ({
  marginTop: theme.space[4],
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const TopContent = styled.View(() => ({
  flexDirection: 'row',
}));

const UserCardContainer = styled.TouchableOpacity(({ theme }) => ({
  paddingHorizontal: theme.horizontalSpace[4],
  paddingVertical: theme.space[4],
  backgroundColor: theme.colors.black[2],
  borderRadius: theme.borderRadius.medium,
  width: '100%',
  marginBottom: theme.space[2],
}));

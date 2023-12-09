import { H4, Label } from '@/components/Typography';
import { colors } from '@/theme/colors';
import styled from '@emotion/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFollowTagMutation, useUnFollowTagMutation } from '../slice/api';
import { TagData } from '../types';

const TagContainer = styled.TouchableOpacity(
  ({ theme: { space, horizontalSpace, colors, borderRadius } }) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    marginBottom: space[2],
    paddingVertical: space[2],
    paddingHorizontal: horizontalSpace[4],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.small,
  }),
);

const TagTitle = styled(H4)(({ theme: {} }) => ({
  flex: 1,
}));

export const FollowButton = styled.TouchableOpacity<{ isFollowing: boolean }>(
  ({ theme: { space, colors, styles, borderRadius }, isFollowing }) => ({
    ...styles.center,
    backgroundColor: isFollowing ? 'transparent' : colors.darkYellow,
    paddingHorizontal: isFollowing ? 0 : space[3],
    paddingVertical: space[2],
    borderRadius: borderRadius.small,
    width: space[17],
  }),
);

interface IProp {
  data: TagData;
  callBackIsFollow?: (isFollow: boolean) => void;
}

const TagItem = ({ data, callBackIsFollow }: IProp) => {
  const [followStatus, setFollowStatus] = useState(data.isFollowing);

  const [followTag, { isLoading: isFollowing, isSuccess: isFollowSuccess }] =
    useFollowTagMutation();

  const [
    unFollowTag,
    { isLoading: isUnfollowing, isSuccess: isUnfollowSuccess },
  ] = useUnFollowTagMutation();

  const handleOnToggleFollow = (id: string, followed: boolean) => async () => {
    const payload = { tag: id };
    if (followed) {
      await unFollowTag(payload);
    } else {
      await followTag(payload);
    }
  };

  useEffect(() => {
    if (isFollowSuccess) {
      setFollowStatus(true);
      callBackIsFollow && callBackIsFollow(true);
    }
  }, [callBackIsFollow, isFollowSuccess]);

  useEffect(() => {
    if (isUnfollowSuccess) {
      setFollowStatus(false);
      callBackIsFollow && callBackIsFollow(false);
    }
  }, [callBackIsFollow, isUnfollowSuccess]);

  return (
    <TagContainer>
      <TagTitle fontWeight="bold">{data?.tag?.content}</TagTitle>
      <FollowButton
        isFollowing={followStatus}
        onPress={handleOnToggleFollow(data?.tag?.id, followStatus)}>
        {isFollowing || isUnfollowing ? (
          <ActivityIndicator size={'small'} animating color={colors.white} />
        ) : (
          <Label fontWeight="bold" color={colors.lightGreen}>
            {followStatus ? 'Following' : 'Follow'}
          </Label>
        )}
      </FollowButton>
    </TagContainer>
  );
};

export default TagItem;

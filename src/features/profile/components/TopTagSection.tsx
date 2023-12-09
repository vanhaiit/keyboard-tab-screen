import Row from '@/components/Row';
import { Label, H4 } from '@/components/Typography';

import { useTheme } from '@emotion/react';
import { View, ActivityIndicator } from 'react-native';
import { TopTag } from '../types';
import { useFollowTagMutation, useUnFollowTagMutation } from '../slice/api';
import { useState } from 'react';

import Empty from '@/components/Empty';
import { FollowButton } from '@/components/ProfileCardItem';

const TopTagSection = ({
  data,
  isLoading,
}: {
  data: TopTag[];
  isLoading: boolean;
}) => {
  const { space, colors, borderRadius } = useTheme();

  const [followTag, { isLoading: isFollowingTag }] = useFollowTagMutation();

  const [unFollowTag, { isLoading: isUnfollowingTag }] =
    useUnFollowTagMutation();

  const [selectingTag, setSelectingTag] = useState<string>();

  const handleOnToggleFollow = (id: string, followed: boolean) => async () => {
    setSelectingTag(id);
    const payload = { tag: id };
    if (followed) {
      await unFollowTag(payload);
    } else {
      await followTag(payload);
    }
  };

  return (
    <View style={{ paddingHorizontal: space[4], paddingTop: space[6] }}>
      <Label fontWeight="bold" color={colors.lightGreen}>
        Top Tags
      </Label>

      {Array.isArray(data) && data.length ? (
        data.map(item => (
          <Row
            key={item.content}
            style={{
              paddingHorizontal: space[4],
              paddingVertical: space[2],
              borderRadius: borderRadius.small,
              backgroundColor: colors.primary,
              marginVertical: space[2],
            }}>
            <View style={{ flex: 1 }}>
              <H4 fontWeight="bold">{item?.content}</H4>
              <Label style={{ paddingTop: space[1] }} color={colors.grey[2]}>
                {item?.totalPosts} {item?.totalPosts > 1 ? 'posts' : 'post'}{' '}
                {item?.totalFollowers}{' '}
                {item?.totalFollowers > 1 ? 'followers' : 'follower'}
              </Label>
            </View>

            <FollowButton
              isFollowing={item?.isFollowing}
              onPress={handleOnToggleFollow(item?._id, item?.isFollowing)}>
              {(isLoading || isFollowingTag || isUnfollowingTag) &&
              selectingTag === item?._id ? (
                <ActivityIndicator
                  size={'small'}
                  animating
                  color={colors.white}
                />
              ) : (
                <Label fontWeight="bold" color={colors.lightGreen}>
                  {item?.isFollowing ? 'Following' : 'Follow'}
                </Label>
              )}
            </FollowButton>
          </Row>
        ))
      ) : (
        <Empty style={{ marginVertical: space[2] }} />
      )}
    </View>
  );
};

export default TopTagSection;

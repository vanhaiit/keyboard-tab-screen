import styled from '@emotion/native';
import { useMemo } from 'react';
import Config from 'react-native-config';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { UserProfile } from '../types';
import { Profile } from '@/features/auth/types';

export const StyledImage = styled(FastImage)(
  ({ theme: { space, borderRadius } }) => ({
    width: space[20],
    height: space[20],
    borderRadius: borderRadius.full,
  }),
);

type Props = FastImageProps & {
  profile: UserProfile | Profile | undefined;
};

const Avatar = ({ profile, ...props }: Props) => {
  const avatarUrl = useMemo(() => {
    return (
      profile?.avatar?.url ||
      `${Config.BASE_URL}/uploads/profile-avatars/profile-avatar-${profile?.defaultAvatarIndex}.png`
    );
  }, [profile]);

  return (
    <StyledImage source={{ uri: avatarUrl }} resizeMode="contain" {...props} />
  );
};

export default Avatar;

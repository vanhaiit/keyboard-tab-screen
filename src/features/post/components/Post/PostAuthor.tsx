import { Icons } from '@/assets';
import Avatar from '@/components/Avatar';
import { H4, Label } from '@/components/Typography';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { DAO } from '@/features/dao/types';
import { UserProfile } from '@/features/profile/types';
import { AppRootParams } from '@/navigations/types';
import { useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Config from 'react-native-config';

export const UserName = styled(H4)(() => ({
  fontWeight: 'bold',
}));

const InfoBox = styled.View(({ theme }) => ({
  justifyContent: 'space-between',
  height: theme.scale(38),
}));

const IconBox = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: horizontalSpace[5],
}));

const Wrapper = styled.View(({ theme: { space, horizontalSpace } }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[1],
  marginBottom: space[2],
}));
const CustomRow = styled.Pressable(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[2],
  alignSelf: 'flex-start',
}));

export const CreatedAt = styled(Label)(({ theme: { colors } }) => ({
  color: colors.palette.black[1],
}));

interface Props {
  profile: UserProfile | undefined;
  createdAt: string;
  avatarSize?: number;
  dao?: DAO;
}

const PostAuthor = ({ profile, createdAt, avatarSize, dao }: Props) => {
  const { space, colors } = useTheme();
  const userInfo = useAppSelector(getUserInfo);

  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Dashboard'>>();

  const createdTime = useMemo(() => {
    const timeDiff = dayjs().diff(dayjs(createdAt), 'days', true);
    if (timeDiff <= 2) {
      return dayjs(createdAt).fromNow(false);
    } else {
      return dayjs(createdAt).format('DD/MM/YYYY');
    }
  }, [createdAt]);

  const onProfilePress = () => {
    if (userInfo?.profile?._id === profile?._id) {
      navigate('Profile');
    } else {
      navigate('ProfileDetail', { profileId: profile?._id });
    }
  };

  return (
    <View>
      {dao && (
        <Wrapper>
          <IconBox>
            <Icons.UserMultiIcon color={colors.lightGreen} />
          </IconBox>
          <Label fontWeight="medium">{dao.name}</Label>
        </Wrapper>
      )}

      <CustomRow onPress={onProfilePress}>
        <Avatar
          url={
            profile?.avatar?.url ||
            `${Config.BASE_URL}/uploads/profile-avatars/profile-avatar-${profile?.defaultAvatarIndex}.png`
          }
          size={avatarSize || space[10]}
        />

        <InfoBox>
          <UserName fontWeight="bold">{profile?.username}</UserName>
          <CreatedAt fontWeight="medium">{createdTime}</CreatedAt>
        </InfoBox>
      </CustomRow>
    </View>
  );
};

export default PostAuthor;

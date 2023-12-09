import { UserProfile } from '@/features/profile/types';
import { useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { ActivityIndicator, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import Row from './Row';
import { Label, LargeLabel, TinyLabel } from './Typography';
import useToggleFollow from '@/hooks/useToggleFollow';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useCallback, useState } from 'react';
import CustomModal from './Modal';
import { HeaderModal } from './ConfirmModal';
import ModalButton from './ModalButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParams } from '@/navigations/types';

const Description = styled(TinyLabel)(({ theme: { space } }) => ({
  lineHeight: space[5],
}));

const ProfileCard = styled(Row)(
  ({ theme: { space, borderRadius, colors, horizontalSpace } }) => ({
    paddingVertical: space[2],
    paddingHorizontal: horizontalSpace[4],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.small,
    marginBottom: space[2],
  }),
);
const ID = styled(Label)(({ theme: { space } }) => ({
  lineHeight: space[5],
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

const UsernameWrapper = styled.View(({ theme }) => ({
  flex: 1,
  marginRight: theme.space[2],
}));

const Container = styled.View(
  ({ theme: { space, horizontalSpace, borderRadius, colors } }) => ({
    backgroundColor: colors.white,
    paddingHorizontal: horizontalSpace[6],
    paddingVertical: space[6],
    gap: space[2],
    borderBottomLeftRadius: borderRadius.medium,
    borderBottomRightRadius: borderRadius.medium,
  }),
);

export const ProfileCardItem = ({
  item,
  hideUniqueId,
  hideDescription,
  isFollow = false,
  callBackIsFollow,
}: {
  item: UserProfile;
  hideUniqueId?: boolean;
  hideDescription?: boolean;
  isFollow?: boolean;
  callBackIsFollow?: (isFollow: boolean) => void;
}) => {
  const { space, colors, borderRadius, styles } = useTheme();
  const userInfo = useAppSelector(getUserInfo);
  const [isOpenUnFollowModal, setIsOpenUnFollowModal] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AppStackParams>>();
  const { push } = useNavigation<any>();

  const handlePressProfileCard = () => {
    push('ProfileDetail', {
      profileId: item.id,
    });
  };

  const onToggleFollowSuccess = useCallback(
    (followed: boolean) => {
      callBackIsFollow && callBackIsFollow(followed);
    },
    [callBackIsFollow],
  );

  const { followStatus, isUnfollowing, isFollowing, handleOnToggleFollow } =
    useToggleFollow(item.isFollowing || isFollow, onToggleFollowSuccess);

  const onCloseModal = () => {
    setIsOpenUnFollowModal(false);
  };

  const handlePressFollow = () => {
    if (followStatus) {
      setIsOpenUnFollowModal(true);
      return;
    }
    handleOnToggleFollow(item?._id, followStatus)();
  };

  const handlePressUnFollow = async () => {
    await handleOnToggleFollow(item?._id, true)();
    onCloseModal();
  };

  const renderModalButtons = () => {
    return (
      <Container>
        <ModalButton
          loading={isUnfollowing}
          onPress={handlePressUnFollow}
          label="Unfollow"
          backgroundColor={colors.black[0]}
          labelColor={colors.white}
          borderColor="unset"
        />
        <ModalButton
          onPress={onCloseModal}
          label="Cancel"
          backgroundColor="transparent"
          labelColor={colors.black[0]}
          borderColor={colors.grey[1]}
        />
      </Container>
    );
  };

  return (
    <Pressable onPress={handlePressProfileCard}>
      <ProfileCard>
        <Row style={styles.fill}>
          <FastImage
            source={
              item?.avatar?.url
                ? { uri: item?.avatar?.url }
                : require('@/assets/images/gray-logo.png')
            }
            style={{
              width: space[10],
              height: space[10],
              borderRadius: borderRadius.full,
              marginRight: space[2],
            }}
          />
          <UsernameWrapper>
            <LargeLabel fontWeight="bold" numberOfLines={1}>
              {item?.username}
            </LargeLabel>
            {!hideUniqueId && (
              <ID color={colors.grey[1]} numberOfLines={1}>
                @{item.unique_id}
              </ID>
            )}

            {!hideDescription && (
              <Description color={colors.grey[1]} numberOfLines={1}>
                {item?.yourselfDescription}
              </Description>
            )}
          </UsernameWrapper>
        </Row>
        {userInfo?.profile?._id === item?.id || (
          <FollowButton isFollowing={followStatus} onPress={handlePressFollow}>
            {isFollowing || isUnfollowing ? (
              <ActivityIndicator
                size={'small'}
                animating
                color={colors.white}
              />
            ) : (
              <Label fontWeight="bold" color={colors.lightGreen}>
                {followStatus ? 'Following' : 'Follow'}
              </Label>
            )}
          </FollowButton>
        )}
      </ProfileCard>

      <CustomModal
        isVisible={isOpenUnFollowModal}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
        onBackdropPress={onCloseModal}
        onClose={onCloseModal}
        headerContent={<HeaderModal content={`Unfollow ${item.username}`} />}
        bodyContent={renderModalButtons()}
      />
    </Pressable>
  );
};

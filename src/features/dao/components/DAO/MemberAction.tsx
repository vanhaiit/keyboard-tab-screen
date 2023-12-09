import { ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/store/type';
import { Icons } from '@/assets';
import BottomSheet from '@/components/BottomSheet';
import Button from '@/components/Button';
import { H5, Label, LargeLabel, TinyLabel } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RoleDao, StatusUserDao } from '../../types';
import CustomModal from '@/components/Modal';
import { HeaderModal } from '@/components/ConfirmModal';

import FastImage from 'react-native-fast-image';
import { useModifierDaoMutation } from '../../slice/api';
import Toast from 'react-native-toast-message';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Swipeable } from 'react-native-gesture-handler';
import Row from '@/components/Row';
import styles from '@/theme/styles';

interface IMemberAction {
  role: RoleDao;
  status: StatusUserDao | string;
  avatar: string;
  userName: string;
  idProfile: string;
  idDao: string;
  roleCurrentUser: RoleDao;
  index?: number;
  onSwipeableOpen: (index: number) => void;
  activeIndex?: number;
}

const Roles = [
  {
    icon: Icons.UserCheck,
    label: 'Contributor',
    value: RoleDao.CONTRIBUTOR,
  },
  {
    icon: Icons.UserIcon,
    label: 'User',
    value: RoleDao.USER,
  },
];

export const MemberAction = ({
  role,
  status,
  avatar,
  userName,
  idProfile,
  idDao,
  roleCurrentUser,
  index,
  activeIndex,
  onSwipeableOpen,
}: IMemberAction) => {
  const { space, colors } = useTheme();
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [isModalDelete, setModalDelete] = useState<boolean>(false);

  const [updateUser, { isLoading }] = useModifierDaoMutation();

  const { id } = useAppSelector(getUserInfo)?.profile!;

  const refSwipe = useRef<any>(null);

  const isCurrent = id === idProfile;
  const isAdmin = roleCurrentUser === RoleDao.ADMIN;

  const isEnableAction =
    roleCurrentUser === RoleDao.ADMIN ||
    (roleCurrentUser === RoleDao.CONTRIBUTOR && role === RoleDao.USER);

  const handleCloseModalDelete = useCallback(() => {
    setModalDelete(false);
  }, []);

  useEffect(() => {
    if (activeIndex !== index && activeIndex !== -1) {
      refSwipe?.current?.close();
    }
  }, [activeIndex, index]);

  const handleUpdateMember = async (
    id: string,
    prefix: string,
    roleChange?: RoleDao,
  ) => {
    await updateUser({
      id: idDao,
      prefix: prefix,
      profile: id,
      role: roleChange,
    });
    if (prefix !== 'update-member-role') {
      Toast.show({
        type: '_success',
        text1: 'Success',
        text2:
          prefix === 'remove-member'
            ? 'User has been unblocked from DAO'
            : `${userName}has been removed from DAO`,
        position: 'bottom',
      });
    }
    refSwipe?.current?.close();
    setIsSelect(false);
    setModalDelete(false);
  };

  const renderButtonAction = useMemo(() => {
    return (
      <>
        {Roles?.map((e, index) => {
          const Icon: ReactNode | any = e.icon;
          return (
            <SelectRole
              active={role === e.value}
              key={index}
              onPress={() =>
                handleUpdateMember(idProfile, 'update-member-role', e.value)
              }
              disabled={role === e.value}>
              <BoxLeft>
                <Icon
                  width={space[5]}
                  height={space[5]}
                  color={role === e.value ? colors.black[0] : colors.white}
                />
                <TextRole active={role === e.value} fontWeight="medium">
                  {e?.label}
                </TextRole>
              </BoxLeft>
              {isLoading && role !== e.value && (
                <ActivityIndicator
                  size={'small'}
                  animating
                  color={colors.white}
                />
              )}
            </SelectRole>
          );
        })}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, isLoading]);

  const renderContentModal = () => {
    return (
      <ModalContent>
        <ModalInfo>
          <FastImageStyle
            source={
              avatar
                ? {
                    uri: avatar,
                  }
                : require('@/assets/images/gray-logo.png')
            }
          />
          <LargeLabel
            fontWeight="bold"
            color={colors.black[4]}
            numberOfLines={1}>
            {userName}
          </LargeLabel>
        </ModalInfo>
        <TextNote color={colors.black[4]} fontWeight="normal">
          If deleted, the user will lose all rights to Dao.{' '}
          <H5 color={colors.black[4]} fontWeight="bold">
            And the user cannot rejoin again.
          </H5>{' '}
          However, the post created by the user is maintained as it is.
        </TextNote>
        <BtnConfirmDelete
          text="Confirm"
          textColor={colors.white}
          backgroundColor={colors.black[0]}
          onPress={() => handleUpdateMember(idProfile, 'block-member')}
          loading={isLoading}
        />
      </ModalContent>
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const LeftSwipe = () => {
    return (
      <BoxAction>
        {isAdmin && (
          <BoxSelect onPress={() => setIsSelect(true)}>
            {role === 'contributor' ? (
              <>
                <Icons.UserCheck
                  width={space[4]}
                  height={space[4]}
                  color={colors.black[0]}
                />
                <TinyLabel fontWeight="medium" color={colors.black[0]}>
                  Contributor
                </TinyLabel>
              </>
            ) : (
              <>
                <Icons.UserIcon
                  width={space[4]}
                  height={space[4]}
                  color={colors.black[0]}
                />
                <TinyLabel fontWeight="medium" color={colors.black[0]}>
                  User
                </TinyLabel>
              </>
            )}
          </BoxSelect>
        )}
        <BoxDelete onPress={() => setModalDelete(true)}>
          <Icons.Close
            width={space[4]}
            height={space[4]}
            color={colors.white}
          />
          <TinyLabel fontWeight="medium">Delete</TinyLabel>
        </BoxDelete>
      </BoxAction>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={refSwipe}
        renderRightActions={
          isEnableAction &&
          role !== RoleDao.ADMIN &&
          status !== StatusUserDao.BLOCKED
            ? LeftSwipe
            : undefined
        }
        onSwipeableOpen={() => onSwipeableOpen(index!)}>
        <ProfileCard>
          <Row style={styles.fill}>
            <FastImageStyle
              source={
                avatar
                  ? {
                      uri: avatar,
                    }
                  : require('@/assets/images/gray-logo.png')
              }
            />
            <UsernameWrapper>
              <LargeLabel fontWeight="bold" numberOfLines={1}>
                {userName}
              </LargeLabel>
            </UsernameWrapper>
          </Row>
          {status === StatusUserDao.PUBLIC ? (
            role === RoleDao.ADMIN ? (
              <BoxAdmin>
                <Label fontWeight="bold" color={colors.lightGreen}>
                  Admin
                </Label>
              </BoxAdmin>
            ) : (
              <BoxUser
                activeOpacity={1}
                disabled={
                  roleCurrentUser === RoleDao.USER ||
                  isCurrent ||
                  (roleCurrentUser === RoleDao.CONTRIBUTOR &&
                    role === RoleDao.CONTRIBUTOR)
                }>
                <Label
                  fontWeight="bold"
                  color={
                    role === RoleDao.CONTRIBUTOR
                      ? colors.lightGreen
                      : colors.grey[1]
                  }>
                  {role === RoleDao.CONTRIBUTOR ? 'Contributor' : 'User'}
                </Label>
                {isCurrent && (
                  <Label fontWeight="bold" color={colors.grey[1]}>
                    {' '}
                    (You){' '}
                  </Label>
                )}
                {isEnableAction && <Icons.ArrowRightIcon />}
              </BoxUser>
            )
          ) : (
            (roleCurrentUser === RoleDao.ADMIN ||
              roleCurrentUser === RoleDao.CONTRIBUTOR) && (
              <UnBlockBtn
                text="Unblock"
                textColor={colors.white}
                onPress={() => handleUpdateMember(idProfile, 'remove-member')}
                loading={isLoading}
              />
            )
          )}
          <BottomSheet
            closeModal={() => setIsSelect(false)}
            isVisible={isSelect}
            title="Select"
            renderButtons={renderButtonAction}
          />
          <CustomModal
            onBackdropPress={handleCloseModalDelete}
            onClose={handleCloseModalDelete}
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'}
            isVisible={isModalDelete}
            headerContent={
              <HeaderModal content="Please check before deleting" />
            }
            bodyContent={renderContentModal()}
          />
        </ProfileCard>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export const BoxAdmin = styled.View(
  ({ theme: { colors, space, horizontalSpace, borderRadius } }) => ({
    paddingVertical: space[2],
    paddingHorizontal: horizontalSpace[4],
    backgroundColor: colors.blackYellow,
    borderRadius: borderRadius.medium,
  }),
);

export const BoxUser = styled.TouchableOpacity(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

export const BoxAction = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
}));

export const BoxSelect = styled.TouchableOpacity(
  ({ theme: { horizontalSpace, colors, space } }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen,
    gap: space[2],
    minWidth: horizontalSpace[15],
    paddingHorizontal: horizontalSpace[3],
  }),
);
export const BoxDelete = styled.TouchableOpacity(
  ({ theme: { horizontalSpace, colors, space } }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.alertRed,
    gap: space[2],
    paddingHorizontal: horizontalSpace[3],
  }),
);

const UnBlockBtn = styled(Button)(
  ({ theme: { space, horizontalSpace, borderRadius, colors } }) => ({
    width: horizontalSpace[26],
    height: space[9],
    borderRadius: borderRadius.medium,
    backgroundColor: colors.black[2],
    color: colors.grey[1],
  }),
);

export const SelectRole = styled.TouchableOpacity<{ active: boolean }>(
  ({ theme: { horizontalSpace, colors, space, borderRadius }, active }) => ({
    flexDirection: 'row',
    backgroundColor: active
      ? colors.lightGreen
      : colors.palette.whiteTransparent[1],
    marginBottom: space[2],
    paddingHorizontal: horizontalSpace[4],
    padding: space[3],
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
);

export const BoxLeft = styled.View(({}) => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

export const TextRole = styled(LargeLabel)<{ active: boolean }>(
  ({ theme: { space, colors }, active }) => ({
    marginLeft: space[2],
    color: active ? colors.black[0] : colors.white,
  }),
);

export const ModalContent = styled.View(
  ({ theme: { colors, sizes, horizontalSpace, space } }) => ({
    backgroundColor: colors.white,
    borderBottomLeftRadius: sizes[3],
    borderBottomRightRadius: sizes[3],
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[3],
  }),
);

export const ModalInfo = styled.View(
  ({ theme: { horizontalSpace, space, colors, borderRadius } }) => ({
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[2],
    backgroundColor: colors.grey[4],
    flexDirection: 'row',
    borderRadius: borderRadius.small,
    alignItems: 'center',
  }),
);

export const FastImageStyle = styled(FastImage)(
  ({ theme: { space, borderRadius } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    marginRight: space[2],
  }),
);

export const TextNote = styled(H5)(({ theme: { space, horizontalSpace } }) => ({
  textAlign: 'center',
  paddingHorizontal: horizontalSpace[2],
  paddingVertical: space[4],
}));

export const BtnConfirmDelete = styled(Button)(
  ({ theme: { borderRadius } }) => ({
    borderRadius: borderRadius.medium,
  }),
);

const ProfileCard = styled(Row)(({ theme: { space, colors } }) => ({
  backgroundColor: colors.black[3],
  paddingVertical: space[2],
}));

const UsernameWrapper = styled.View(({ theme }) => ({
  flex: 1,
  marginRight: theme.space[2],
}));

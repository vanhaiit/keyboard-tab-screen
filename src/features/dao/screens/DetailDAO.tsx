import { Icons } from '@/assets';
import BottomSheet from '@/components/BottomSheet';
import { Box } from '@/components/Box';
import BtnSubmit from '@/components/BtnSubmit';
import ButtonChip from '@/components/ButtonChip';
import CustomModal from '@/components/Modal';
import { H1, H2, H3, H4, H5, Label, TinyLabel } from '@/components/Typography';
import { getUserInfo } from '@/features/auth/slice/selectors';
import TopNavBar from '@/features/post/components/CustomTabs/TopNavBar';
import Post from '@/features/post/components/Post';
import { ISheet } from '@/features/post/types';
import { IPost } from '@/features/post/types/Post';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import { useUpdateEffect } from '@/hooks/useUpdateEffect';
import { AppStackParams, AppTabParams } from '@/navigations/types';
import { baseQueryApi } from '@/store/baseQueryApi';
import { useAppDispatch, useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import QuickSetting from '../components/DAO/QuickSetting';
import Topic from '../components/DAO/Topic';
import {
  useGetDAOQuery,
  useGetDaoReqQuery,
  useGetPostDaoQuery,
  useGetUserDaosQuery,
  useJoinDaoMutation,
  useJoinToDaoMutation,
  useLeaverDaoMutation,
  useModifierDaoMutation,
} from '../slice/api';
import { IDAODetail, RULE } from '../types';
let timer: any;
interface IOption {
  title: string;
  icon?: ReactNode | any;
  value: string;
  onSelect: (e: string) => void;
}

const pageLimit = 20;

const initSheet: ISheet = {
  title: '',
  key: '',
  content: () => <></>,
};

const DetailDAO = ({ route }: any) => {
  const { id } = route.params as any;
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState(1);
  const [sheet, setSheet] = useState<ISheet>(initSheet);
  const [selectedSubTab, setSelectedSubTab] = useState<number | string>(1);
  const { colors, horizontalSpace, borderRadius, space } = useTheme();
  const [menu, setMenu] = useState('');
  const [tab, setTab] = useState('all-post');
  const [sortBy, setSortBy] = useState('latest');
  const [type, setType] = useState('');
  const [loadingType, setLoadingType] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const { data: detail } = useGetDAOQuery(id);
  const [inviteActive, setInviteActive] = useState<boolean>(false);
  const user = useAppSelector(getUserInfo);
  const [modifierDAO] = useModifierDaoMutation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NavigationProp<AppTabParams & AppStackParams>>();

  const { data: listUserDaoBlock } = useGetUserDaosQuery(
    {
      _sort: 'createdAt:ASC',
      _limit: -1,
      _start: 0,
      dao: id,
      profile: user?.profile?.id,
      status: 'blocked',
    },
    { skip: !user?.profile?.id && !detail?.id },
  );

  const { data: listUserDao } = useGetUserDaosQuery(
    {
      _sort: 'createdAt:ASC',
      _limit: -1,
      _start: 0,
      dao: id,
      profile: user?.profile?.id,
      status: 'public',
    },
    {
      skip:
        !user?.profile?.id &&
        !detail?.id &&
        !!listUserDaoBlock &&
        !!listUserDaoBlock[0],
    },
  );

  const { data: listReqDao } = useGetDaoReqQuery(
    {
      _sort: 'updatedAt:desc',
      _limit: 1,
      _start: 0,
      dao: id,
      profile: user?.profile?.id,
    },
    { skip: !user?.profile?.id && detail?.classification === 'private' },
  );

  const [joinDAO, { isLoading: isLoadingJoin, isSuccess: isSuccessJoin }] =
    useJoinDaoMutation();
  const [
    joinToDAO,
    { isLoading: isLoadingJoinTo, isSuccess: isSuccessJoinTo },
  ] = useJoinToDaoMutation();
  const [
    leaverDao,
    { isLoading: isLoadingLeaver, isSuccess: isSuccessLeaver },
  ] = useLeaverDaoMutation();

  const currentUser = listUserDao?.find(
    e => e?.profile?.id === user?.profile?.id,
  );

  const isAdmin = user?.profile?.walletAddress === detail?.walletAddress;

  const isContributor = detail?.contributors?.some(
    e => e.walletAddress === user?.profile?.walletAddress,
  );

  const isBlock = !!listUserDaoBlock && !!listUserDaoBlock[0];
  const isJoined = !isBlock && !!currentUser;
  const isRequestJoin =
    !isBlock &&
    !isJoined &&
    !!listReqDao &&
    !!listReqDao[0] &&
    listReqDao[0]?.status === 'pending';
  const params: any = {
    id,
    payload: {
      _limit: pageLimit,
      menu,
      sortBy,
      tab,
    },
  };

  if (!params.payload.menu) {
    delete params.payload.menu;
  }

  const {
    combinedData: posts,
    isLoading,
    isFetching,
    loadMore,
    refresh,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetPostDaoQuery,
    params,
    skip: selectedTab === 1 || isBlock,
  });

  useEffect(() => {
    if (detail?.id) {
      setInviteActive(detail?.invitation);
      setType(detail.classification);
    }
    if (!isAdmin) {
      setSelectedTab(2);
    } else {
      setSelectedTab(1);
    }
  }, [detail, isAdmin]);

  useUpdateEffect(() => {
    if (selectedSubTab === 1) {
      setTab('all-post');
    } else {
      setTab('like');
    }
  }, [selectedSubTab]);

  useUpdateEffect(() => {
    refresh();
    setSheet(initSheet);
  }, [menu, sortBy, tab]);

  useUpdateEffect(() => {
    if (isSuccessJoin || isSuccessJoinTo || isSuccessLeaver) {
      dispatch(baseQueryApi.util.resetApiState());
      setShowModal(0);
    }
  }, [isSuccessJoin, isSuccessJoinTo, isSuccessLeaver]);

  const styles = useMemo(() => {
    return {
      padding: space[4],
    };
  }, [space]);

  const optionFilters = useMemo(() => {
    let _menu = [
      {
        title: 'All',
        icon: Icons.Option,
        value: '',
        onSelect: onChangeMenu,
      },
      {
        title: 'General',
        icon: Icons.WarningIcon,
        value: 'general',
        onSelect: onChangeMenu,
      },
      {
        title: 'Announcement',
        icon: Icons.InviteIcon,
        value: 'announcement',
        onSelect: onChangeMenu,
      },
    ];
    if (detail?.menu?.list && detail?.menu.list.length > 0) {
      const temp: any = detail?.menu?.list.map(e => ({
        title: e.title,
        value: e.title,
        icon: EmptyIcon,
        onSelect: onChangeMenu,
      }));
      _menu = [..._menu, ...temp];
    }
    return _menu;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, detail]);

  const optionSort = useMemo(
    () => [
      { title: 'Latest', value: 'latest', onSelect: onChangeSort },
      { title: 'Top', value: 'top', onSelect: onChangeSort },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const optionSetting = useMemo(
    () => [
      {
        title: 'Members Request',
        value: 'MembersRequest',
        icon: Icons.UserCheck,
        onSelect: onOpenMemberRequest,
      },
      {
        title: 'Reported Posts',
        value: 'Reported Posts',
        icon: Icons.EditIcon,
        onSelect: onReportedPost,
      },
      {
        title: 'Members',
        value: 'Members',
        icon: Icons.Friend,
        onSelect: onOpenMember,
      },
      {
        title: 'Rules',
        value: 'Rules',
        icon: Icons.PostIcon,
        onSelect: () => onNavigate('Rule', detail),
      },
      {
        title: 'FAQ',
        value: 'FAQ',
        icon: Icons.Faq,
        onSelect: () => onNavigate('FAQ', detail),
      },
      {
        title: 'Settings',
        value: 'Settings',
        icon: Icons.Setting,
        onSelect: () => detail && onNavigate('CreateDAO', detail),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detail],
  );

  const onNavigate = (screen: any, data?: RULE[] | IDAODetail) => {
    setSheet(initSheet);
    navigation.navigate(screen, { data: data || [] });
  };

  const optionView = useMemo(
    () => [
      {
        title: 'Members',
        value: 'Members',
        icon: Icons.UserIcon,
        onSelect: onOpenMember,
      },
      {
        title: 'Rules',
        value: 'Rules',
        icon: Icons.PostIcon,
        onSelect: () => onNavigate('Rule', detail?.rule?.list),
      },
      {
        title: 'FAQ',
        value: 'FAQ',
        icon: Icons.Faq,
        onSelect: () => onNavigate('FAQ', detail?.faq?.list),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detail],
  );

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {isFetching && selectedTab === 2 ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color={colors.white} />
          </LoadingContainer>
        ) : null}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, selectedTab, isFetching]);

  function onChangeMenu(value: string) {
    refresh();
    setMenu(value);
    setSortBy('latest');
    setTab('');
  }

  function onChangeSort(value: string) {
    navigation.navigate(value as any, { id: id });
    refresh();
    setSortBy(value);
  }

  function onReportedPost() {
    setSheet(initSheet);
    navigation.navigate('ReportedPosts', { id });
  }

  function onOpenMemberRequest() {
    setSheet(initSheet);
    navigation.navigate('MembersRequest', { id });
  }

  function onOpenMember() {
    setSheet(initSheet);
    navigation.navigate('Members', { id });
  }

  const handleTabChange = useCallback((value: number) => {
    setSelectedTab(value);
  }, []);

  const handleSubTabChange = useCallback((value: number | string) => {
    setSelectedSubTab(value);
  }, []);

  const filterTabTopic = () => {
    setSheet({
      title: 'Select topic',
      key: 'menu',
      content: () => renderFilterTab(optionFilters),
      // eslint-disable-next-line react/no-unstable-nested-components
      footer: () => <></>,
    });
  };

  const onSortTopic = () => {
    setSheet({
      title: 'Sort Topic',
      key: 'sort',
      content: () => renderFilterTab(optionSort),
      // eslint-disable-next-line react/no-unstable-nested-components
      footer: () => <></>,
    });
  };

  const onChangeStatusInvite = async (value: boolean) => {
    setInviteActive(value);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const res: any = await modifierDAO({
        invitation: value,
        id,
        prefix: 'set-invitation',
      });
      if (res.data.code !== 200) {
        setInviteActive(false);
        Toast.show({
          type: '_error',
          text1: 'Error',
          text2: 'Set invitation false',
          position: 'bottom',
        });
      }
    }, 500);
  };

  const onChangeTypeDAO = async (value: string) => {
    try {
      setLoadingType(true);
      setType(value);
      const res: any = await modifierDAO({
        type: value,
        id,
        prefix: 'update-dao-type',
      });
      if (res.data.code !== 200) {
        setInviteActive(false);
        Toast.show({
          type: '_error',
          text1: 'Error',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: DetailDAO.tsx:240 ~ onChangeTypeDAO ~ error:',
        error,
      );
    } finally {
      setLoadingType(false);
    }
  };

  const renderFilterTab = (data: IOption[]) => {
    return (
      <OptionContainer>
        {data.map((e, index) => {
          const active = menu === e.value || sortBy === e.value;
          const Icon: ReactNode | any = e.icon;
          return (
            <Option
              key={index}
              onPress={() => e?.onSelect(e.value)}
              style={{
                backgroundColor: active ? colors.lightGreen : colors.black[5],
              }}>
              {e.icon && (
                <IconBox>
                  <Icon color={active ? colors.black[0] : colors.white} />
                </IconBox>
              )}
              <TextOption
                style={{
                  color: active ? colors.black[0] : colors.white,
                }}>
                {e.title}
              </TextOption>
            </Option>
          );
        })}
      </OptionContainer>
    );
  };

  const renderSeparator = useCallback(() => <Separator />, []);

  const onDeleteDao = async () => {
    setSheet(initSheet);
    setShowModal(1);
  };

  const handleDelete = async () => {
    const res: any = await modifierDAO({ id, prefix: 'delete' });
    if (!res.data) {
      setInviteActive(false);
      return Toast.show({
        type: '_error',
        text1: 'Error',
        position: 'bottom',
      });
    }
    dispatch(baseQueryApi.util.resetApiState());
    navigation.navigate('Dashboard');
  };

  const onOpenSetting = () => {
    setSheet({
      title: 'DAO menu',
      key: 'setting',
      content: () => renderFilterTab(optionSetting),
      // eslint-disable-next-line react/no-unstable-nested-components
      footer: () => (
        <Option
          onPress={onDeleteDao}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            backgroundColor: colors.alertRed,
            justifyContent: 'center',
          }}>
          <TextOption style={{ color: colors.black[0] }} fontWeight="bold">
            Delete DAO
          </TextOption>
        </Option>
      ),
    });
  };

  const onOpenView = () => {
    setSheet({
      title: 'View',
      key: 'setting',
      content: () => renderFilterTab(optionView),
      // eslint-disable-next-line react/no-unstable-nested-components
      footer: () => <></>,
    });
  };

  function onJoinDAO() {
    try {
      type === 'public' ? joinDAO({ daoId: id }) : joinToDAO({ daoId: id });
    } catch (error) {
      console.log('🚀 ~ file: DetailDAO.tsx:515 ~ onJoinDAO ~ error:', error);
    }
  }

  function onLeaverDAO() {
    try {
      leaverDao({ daoId: id });
    } catch (error) {
      console.log('🚀 ~ file: DetailDAO.tsx:515 ~ onJoinDAO ~ error:', error);
    }
  }

  const renderToolbar = () => {
    return (
      <>
        <ToolBarRow>
          {isAdmin || isContributor ? (
            <TopNavBar
              activeAnimation={false}
              value={selectedTab}
              onChange={handleTabChange}
              itemWidth={space[21]}
              data={[
                {
                  label: 'Quick setting',
                },
                {
                  label: 'DAO’s topic',
                },
              ].map(item => item.label)}
            />
          ) : (
            <View />
          )}
          {selectedTab === 2 && (
            <BtnSubmit
              onPress={filterTabTopic}
              style={{
                width: horizontalSpace[16],
                height: space[10],
                borderRadius: borderRadius.large,
                backgroundColor: colors.black[2],
              }}
              iconPrefix={
                <IconFilter>
                  <Icons.Option color={colors.white} />
                  <Icons.ArrowDown color={colors.white} />
                </IconFilter>
              }
            />
          )}
        </ToolBarRow>
        {selectedTab === 2 ? (
          <Topic
            disableHiddenToolbar={tab === 'like' ? true : undefined}
            onSort={onSortTopic}
            handleTabChange={handleSubTabChange}
            selectedTab={selectedSubTab}
            emptyData={posts.length === 0 && !isFetching}
          />
        ) : (
          <QuickSetting
            invitation={inviteActive}
            loadingType={loadingType}
            classification={type}
            onChangeInvitation={onChangeStatusInvite}
            onChangeClassification={onChangeTypeDAO}
          />
        )}
      </>
    );
  };

  const renderHeader = () => (
    <View>
      <Preview>
        <AvatarContainer>
          <Avatar
            source={
              detail?.avatar?.url
                ? {
                    uri: detail?.avatar?.url,
                  }
                : require('@/assets/images/gray-logo.png')
            }
          />
        </AvatarContainer>
        <Info>
          <NumberContainer>
            <PostView>
              <Number fontWeight="bold">{detail?.totalPosts || 0}</Number>
              <Sub>Post</Sub>
            </PostView>
            <Follower>
              <Number fontWeight="bold">{detail?.totalFollowers || 0}</Number>
              <Sub>Follower</Sub>
            </Follower>
          </NumberContainer>
          <ActionInfo>
            <Invite>
              <BtnSubmit
                label="Invite"
                style={{
                  height: horizontalSpace[10],
                  borderRadius: borderRadius.large,
                  backgroundColor:
                    isJoined && isAdmin && inviteActive
                      ? colors.lightGreen
                      : colors.grey[1],
                }}
                onPress={() =>
                  (isJoined || isAdmin) &&
                  navigation.navigate('InviteDAO', { id })
                }
                iconPrefix={<Icons.InviteIcon color={colors.black[0]} />}
              />
            </Invite>
            {isAdmin || isContributor ? (
              <Setting onPress={onOpenSetting}>
                <Icons.Setting color={colors.white} />
              </Setting>
            ) : (
              <Setting onPress={onOpenView}>
                <Icons.PostIcon color={colors.white} />
              </Setting>
            )}
          </ActionInfo>
        </Info>
      </Preview>
      <Box>
        <Description>{detail?.description}</Description>
        <Link>
          <TitleLink>LINK</TitleLink>
          {detail?.snsLink?.list &&
            detail?.snsLink?.list?.length > 0 &&
            detail?.snsLink?.list?.map((e, index) => (
              <ButtonChip key={index} icon={<Icons.GlobeIcon />} label={e} />
            ))}
        </Link>
        <Link>
          <TitleLink>LINK</TitleLink>
          <ButtonChip icon={<Icons.GlobeIcon />} label={detail?.region || ''} />
        </Link>
      </Box>
      {isAdmin || isContributor || type === 'public' ? (
        renderToolbar()
      ) : (
        <>
          {isJoined ? (
            renderToolbar()
          ) : (
            <PrivateView>
              <Icons.Private />
              <PrivateText fontWeight="bold">This DAO is private</PrivateText>
              <PrivateDescription>
                If you want to participate, please apply to the admin.
              </PrivateDescription>
            </PrivateView>
          )}
        </>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaViewContainer edges={['bottom']}>
        <Container style={{ paddingTop: insets.top }}>
          <Header>
            <HeaderLeft>
              <BtnBack onPress={() => navigation.goBack()}>
                <Icons.ArrowLeft />
              </BtnBack>
              <TitleContainer>
                <Title fontWeight="bold" numberOfLines={1}>
                  {detail?.name && detail?.name?.length > (!isAdmin ? 15 : 20)
                    ? detail?.name?.substring(0, (!isAdmin ? 15 : 20) - 3) +
                      '...'
                    : detail?.name}
                </Title>
                <TitleIcon>
                  {type === 'public' ? (
                    <Icons.UnlockIcon color={colors.lightGreen} />
                  ) : (
                    <Icons.LockIcon color={colors.lightGreen} />
                  )}
                </TitleIcon>
                {isAdmin && (
                  <AdminBox>
                    <AdminLabel>Admin</AdminLabel>
                  </AdminBox>
                )}
              </TitleContainer>
            </HeaderLeft>
            {!isAdmin && (
              <>
                {isBlock && (
                  <HeaderRight>
                    <BtnSave
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        backgroundColor: colors.black[3],
                        borderWidth: 1,
                        borderColor: colors.grey[1],
                      }}>
                      <TextSave
                        style={{ color: colors.grey[1] }}
                        fontWeight="bold">
                        Blocked
                      </TextSave>
                    </BtnSave>
                  </HeaderRight>
                )}
                {isJoined && (
                  <HeaderRight>
                    <BtnSave
                      onPress={() => setShowModal(2)}
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        backgroundColor: colors.black[3],
                        borderWidth: 1,
                        borderColor: colors.grey[1],
                      }}>
                      <TextSave
                        style={{ color: colors.grey[1] }}
                        fontWeight="bold">
                        Leave DAO
                      </TextSave>
                    </BtnSave>
                  </HeaderRight>
                )}
                {isRequestJoin && (
                  <HeaderRight>
                    <BtnSave
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        backgroundColor: colors.black[3],
                        borderWidth: 1,
                        borderColor: colors.grey[1],
                      }}>
                      <TextSave
                        style={{ color: colors.grey[1] }}
                        fontWeight="bold">
                        Pending
                      </TextSave>
                    </BtnSave>
                  </HeaderRight>
                )}
                {!isJoined && !isRequestJoin && !isBlock && (
                  <>
                    {type === 'private' && (
                      <HeaderRight>
                        <BtnSave onPress={onJoinDAO}>
                          <TextSave fontWeight="bold">
                            {isLoadingJoin || isLoadingJoinTo
                              ? 'Loading ...'
                              : 'Apply Join DAO'}
                          </TextSave>
                        </BtnSave>
                      </HeaderRight>
                    )}
                    {type === 'public' && (
                      <HeaderRight>
                        <BtnSave onPress={onJoinDAO}>
                          <TextSave fontWeight="bold">
                            {isLoadingJoin || isLoadingJoinTo
                              ? 'Loading ...'
                              : 'Join DAO'}
                          </TextSave>
                        </BtnSave>
                      </HeaderRight>
                    )}
                  </>
                )}
              </>
            )}
          </Header>
          <FlashList
            contentContainerStyle={styles}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            data={selectedTab === 1 ? [] : (posts as IPost[])}
            keyExtractor={(item: IPost, index: number) =>
              item.id.toString() + index
            }
            renderItem={({ item }: any) => (
              <Post key={item.id} postData={item!} />
            )}
            ListHeaderComponent={renderHeader}
            estimatedItemSize={200}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={LoadingIcon}
          />
          {!!sheet.title && (
            <BottomSheet
              isVisible={!!sheet.title}
              title={sheet?.title || ''}
              description={sheet?.description}
              closeModal={() => setSheet(initSheet)}
              renderContent={sheet?.content}
              renderFooter={sheet?.footer}
            />
          )}
        </Container>
        <CustomModal
          onClose={() => setShowModal(0)}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          isVisible={showModal !== 0}
          headerContent={
            <HeaderModal
              title={showModal === 1 ? 'Delete the DAO' : 'Leave the DAO?'}
            />
          }
          bodyContent={
            <BodyContainer>
              <Item>
                <SubDescription>
                  {showModal === 1
                    ? 'Private is visible only to authorized users, and public is visible to all users.'
                    : ''}
                </SubDescription>
                <SubDescription>
                  {isLoadingLeaver && 'Loading...'}
                </SubDescription>
              </Item>
              <BtnSubmit
                bg={colors.black[0]}
                styleLabel={{ color: colors.white }}
                label={showModal === 1 ? 'Delete' : 'Leaver DAO'}
                onPress={showModal === 1 ? handleDelete : onLeaverDAO}
              />
              <BtnSubmit
                bg={colors.white}
                styleLabel={{ color: colors.black[0] }}
                label="Cancel"
                onPress={() => setShowModal(0)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ borderWidth: 1, marginTop: -space[5] }}
              />
            </BodyContainer>
          }
        />
      </SafeAreaViewContainer>
    </KeyboardAvoidingView>
  );
};

const HeaderModal = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <CustomGradientBg
      colors={[
        '#6D89F6',
        '#73ACD6',
        '#7BD5B2',
        '#7EE5A2',
        '#80F394',
        '#81F88F',
        '#9CF884',
        theme.colors.palette.lightGreen,
      ]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      locations={[0, 0.1, 0.22, 0.29, 0.38, 0.45, 0.64, 1]}>
      <HeaderText>{title}</HeaderText>
    </CustomGradientBg>
  );
};

export default DetailDAO;

const PrivateView = styled.View(({ theme: { space } }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: space[6],
}));

const PrivateDescription = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const PrivateText = styled(H3)(({ theme: { colors, space } }) => ({
  color: colors.lightGreen,
  paddingTop: space[6],
}));

const TextSave = styled(H5)(({ theme: { colors, horizontalSpace } }) => ({
  color: colors.palette.black[4],
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
}));

const BtnSave = styled.TouchableOpacity(
  ({ theme: { colors, borderRadius, space } }) => ({
    backgroundColor: colors.palette.lightGreen,
    // width: space[14],
    height: space[8],
    borderRadius: borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

const HeaderRight = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[32],
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const HeaderText = styled(H2)(({ theme: { colors, space } }) => ({
  color: colors.palette.black[3],
  fontWeight: 'bold',
  paddingTop: space[5],
}));

const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { space, sizes } }) => ({
    height: space[28],
    borderTopLeftRadius: sizes[3],
    borderTopRightRadius: sizes[3],
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const SubDescription = styled(H5)(({ theme: { colors } }) => ({
  color: colors.black[0],
  textAlign: 'center',
}));

const BodyContainer = styled.View(({ theme: { colors, space } }) => ({
  backgroundColor: colors.white,
  width: '100%',
  borderBottomLeftRadius: space[2],
  borderBottomRightRadius: space[2],
  paddingTop: space[6],
  paddingLeft: space[4],
  paddingRight: space[4],
}));

const Item = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  marginBottom: space[4],
}));

const EmptyIcon = styled.View(({ theme: { space, horizontalSpace } }) => ({
  width: horizontalSpace[2],
  height: space[2],
}));

const IconBox = styled.View(({ theme: { space } }) => ({
  width: space[5],
  height: space[5],
}));

const TextOption = styled(H4)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const OptionContainer = styled.View(() => ({
  // padding: space[4],
}));

const Option = styled.Pressable(
  ({ theme: { borderRadius, space, colors, horizontalSpace } }) => ({
    borderRadius: borderRadius.large,
    height: space[12],
    backgroundColor: colors.black[5],
    marginBottom: space[2],
    flexDirection: 'row',
    gap: horizontalSpace[3],
    alignItems: 'center',
    padding: horizontalSpace[4],
  }),
);

const IconFilter = styled.View(({ theme: { horizontalSpace } }) => ({
  paddingLeft: horizontalSpace[5],
  flexDirection: 'row',
  gap: horizontalSpace[1],
}));

const ToolBarRow = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const View = styled.View(({ theme: { space } }) => ({
  marginBottom: space[4],
}));

const Avatar = styled(FastImage)(({ theme: { borderRadius } }) => ({
  borderRadius: borderRadius.full,
  width: '100%',
  height: '100%',
}));

const TitleLink = styled(TinyLabel)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  paddingRight: space[4],
  width: space[10],
}));

const Link = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height: space[6],
  marginBottom: space[2],
  marginTop: space[2],
}));

const Description = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const NumberContainer = styled.View(({ theme: { space } }) => ({
  height: space[12],
  flexDirection: 'row',
}));

const Setting = styled.Pressable(
  ({ theme: { space, borderRadius, colors, horizontalSpace } }) => ({
    width: space[10],
    borderWidth: 1,
    borderRadius: borderRadius.large,
    height: horizontalSpace[10],
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grey[1],
  }),
);

const Invite = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[37],
  marginRight: horizontalSpace[2],
}));

const ActionInfo = styled.View(({ theme: { space } }) => ({
  height: space[12],
  flexDirection: 'row',
}));

const Follower = styled.View(() => ({
  width: '50%',
  alignItems: 'center',
}));

const PostView = styled.View(() => ({
  width: '50%',
  alignItems: 'center',
}));

const Number = styled(H2)(({ theme: { colors } }) => ({
  color: colors.white,
}));

const Sub = styled(Label)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const Info = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[50],
}));

const AvatarContainer = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[24],
  height: horizontalSpace[24],
}));

const Preview = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: space[4],
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
}));

const Container = styled.View(({ theme: { colors } }) => ({
  display: 'flex',
  backgroundColor: colors.black[3],
  height: '100%',
}));

const Header = styled.View(({ theme: { space, horizontalSpace, window } }) => ({
  height: space[10],
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
  flexDirection: 'row',
  maxWidth: window.width,
  justifyContent: 'space-between',
}));

const HeaderLeft = styled.View({
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const BtnBack = styled.TouchableOpacity(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[7],
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Title = styled(H1)(() => ({
  color: 'white',
}));

const TitleIcon = styled.View(({ theme: { space, horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: space[5],
  marginLeft: horizontalSpace[2],
}));

const TitleContainer = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
  height: 50,
  alignItems: 'center',
  flex: 1,
}));

const AdminBox = styled.View(
  ({ theme: { space, borderRadius, horizontalSpace, colors } }) => ({
    width: horizontalSpace[13],
    height: space[6],
    borderRadius: borderRadius.full,
    backgroundColor: colors.black[2],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: horizontalSpace[2],
  }),
);

const AdminLabel = styled(Label)(({ theme: { colors } }) => ({
  color: colors.white,
}));

const Separator = styled.View(({ theme: { space } }) => ({
  height: space[5],
}));

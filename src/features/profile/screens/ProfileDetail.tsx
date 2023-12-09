import { useTheme } from '@emotion/react';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';
import { H2, H4, Label, SmallBody, SmallLabel } from '@/components/Typography';
import Row from '@/components/Row';
import styled from '@emotion/native';
import { Icons } from '@/assets';
import AdminSection from '../components/AdminSection';
import ContributeSection from '../components/ContributeSection';
import TopLinkSection from '../components/TopLinkSection';
import TopTagSection from '../components/TopTagSection';
import MostLikedSection from '../components/MostLikedSection';
import ButtonChip from '../../../components/ButtonChip';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import {
  useCountFollowingQuery,
  useGetDAOUsersQuery,
  useGetDAOsQuery,
  useGetLinksQuery,
  useGetMostLikedUsersQuery,
  useGetProfileInfoQuery,
  useGetTopTagsQuery,
  useUpdateProfileMutation,
  useGetProfileUniqueIdQuery,
  useUploadImageMutation,
} from '../slice/api';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import dayjs from 'dayjs';
import { useGetPostsQuery } from '@/features/post/slice/api';
import LatestPostSection from '../components/LatestPostSection';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import useToggleFollow from '@/hooks/useToggleFollow';
import Stat from '@/components/Stat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NFTSection from '../components/NFTSection';
import { useFetchDecoratedPoposMutation } from '@/features/nft/slice/api';
import { useEffect, useMemo } from 'react';
import Config from 'react-native-config';
import { ActivityScreen } from '../types';
import * as RNLocalize from 'react-native-localize';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import Avatar from '../components/Avatar';

const FollowButton = styled.TouchableOpacity(
  ({ theme: { space, colors, borderRadius } }) => ({
    width: space[27],
    height: space[10],
    borderRadius: borderRadius.small,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const CopyButton = styled.TouchableOpacity(
  ({ theme: { space, colors, borderRadius } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.small,
    borderColor: colors.grey[1],
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: space[2],
  }),
);

export const StatLabel = styled(Label)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  paddingTop: space[2],
}));

const VerticalDivider = styled.View(({ theme: { colors, space } }) => ({
  height: space[6],
  width: 1,
  backgroundColor: colors.whiteTransparent[1],
}));

const TimeStat = ({
  isLast,
  label,
  value,
}: {
  isLast?: boolean;
  label: string;
  value: string;
}) => {
  const { colors, space } = useTheme();
  return (
    <Row style={{ justifyContent: 'space-between', flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Label color={colors.grey[2]}>{label}</Label>
        <Label fontWeight="bold" style={{ paddingTop: space[1] }}>
          {value}
        </Label>
      </View>
      {!isLast && <VerticalDivider />}
    </Row>
  );
};

export const CoverImageContainer = styled.ImageBackground<{
  isLoading: boolean;
}>(({ theme: { colors, window }, isLoading }) => ({
  width: '100%',
  height: window.height * 0.2,
  backgroundColor: colors.primary,
  opacity: isLoading ? 0.5 : 1,
}));

export const Container = styled.View(({ theme: { colors } }) => ({
  flex: 1,
  backgroundColor: colors.background,
}));

const CoverImageButtonRow = styled(Row)(({ theme: { space } }) => ({
  justifyContent: 'space-between',
  paddingHorizontal: space[4],
}));

const CoverImageButton = styled.Pressable(
  ({ theme: { space, styles, colors, borderRadius } }) => ({
    ...styles.center,
    backgroundColor: colors.grey[3],
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
  }),
);

export const ProfileInfoRow = styled.View(
  ({ theme: { space, horizontalSpace } }) => ({
    marginTop: space[12],
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: horizontalSpace[4],
  }),
);

export const StatRow = styled(Row)(({ theme: { space } }) => ({
  marginTop: space[4],
  paddingHorizontal: space[4],
  paddingBottom: space[1],
}));

const StatisticContainer = styled(Row)(({ theme: { space, colors } }) => ({
  borderColor: colors.black[2],
  borderTopWidth: 1,
  borderBottomWidth: 1,
  paddingVertical: 10,
  //paddingHorizontal: space[4],
  marginTop: space[4],
}));

export const ProfilePic = styled(Avatar)(({ theme: { space, colors } }) => ({
  position: 'absolute',
  top: -space[20] / 2,
  left: space[4],
  borderWidth: 3,
  backgroundColor: colors.white,
}));

const BackButton = styled.Pressable(
  ({ theme: { space, colors, borderRadius } }) => ({
    zIndex: 2,
    backgroundColor: colors.grey[3],
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

const ButtonInfo = styled(ButtonChip)({
  marginTop: 0,
});

const CoverImageLoading = styled.ActivityIndicator({
  alignSelf: 'center',
});

const ProfileDetail = () => {
  const { space, colors, styles } = useTheme();
  const route = useRoute<RouteProp<AppRootParams, 'ProfileDetail'>>();
  const { goBack, navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Profile'>>();
  const userInfo = useAppSelector(getUserInfo);
  const profileIdRoute = route?.params?.profileId;
  const uniqueIdRoute = route?.params?.uniqueId;

  const isNotMyProfile =
    !!profileIdRoute && profileIdRoute !== userInfo?.profile?._id;

  const { data: profileByUnique, isLoading: loadingProfileUnique } =
    useGetProfileUniqueIdQuery(
      {
        _sort: 'createdAt:desc',
        _limit: 1,
        _start: 0,
        unique_id: uniqueIdRoute,
      },
      {
        skip: !uniqueIdRoute,
      },
    );

  const profileId = useMemo(() => {
    return (
      profileIdRoute ||
      (profileByUnique &&
        profileByUnique?.length > 0 &&
        profileByUnique[0]?.id) ||
      userInfo?.profile?._id ||
      ''
    );
  }, [profileByUnique, profileIdRoute, userInfo?.profile?._id]);

  const { data: profileData } = useGetProfileInfoQuery(profileId, {
    skip: !profileId || loadingProfileUnique,
  });

  const { data: links } = useGetLinksQuery(profileId, {
    skip: !profileId || loadingProfileUnique,
  });

  const { data: admins } = useGetDAOsQuery(profileId, {
    skip: !profileId || loadingProfileUnique,
  });

  const { data: contributors } = useGetDAOUsersQuery(
    {
      role: 'contributor',
      profile: profileId,
    },
    {
      skip: !profileId || loadingProfileUnique,
    },
  );

  const { data: tags, isFetching: isTagFetching } = useGetTopTagsQuery(
    profileId,
    {
      skip: !profileId || loadingProfileUnique,
    },
  );

  const { data: mostLikedUsers } = useGetMostLikedUsersQuery(profileId, {
    skip: !profileId || loadingProfileUnique,
  });

  const { data: latestPosts } = useGetPostsQuery(
    {
      _sort: 'createdAt:desc',
      _limit: 5,
      _start: 0,
      profile: profileId,
    },
    {
      skip: !profileId || loadingProfileUnique,
    },
  );

  const { data: followCount } = useCountFollowingQuery(
    {
      follow: profileId || '',
      follower: userInfo?.profile?._id || '',
    },
    {
      skip: !profileId || loadingProfileUnique,
    },
  );

  const [upload, { isLoading: isUploading }] = useUploadImageMutation();

  const [updateCoverImage, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const { followStatus, isUnfollowing, isFollowing, handleOnToggleFollow } =
    useToggleFollow(!!(followCount && followCount > 0));

  // nft

  const [
    fetchDecoratedPopos,
    { isLoading: isFetchDataLoading, data: dataNft },
  ] = useFetchDecoratedPoposMutation();

  useEffect(() => {
    if (!profileData) {
      return;
    }
    fetchDecoratedPopos({
      unique_id: profileData?.unique_id,
      _limit: 4,
    });
  }, [fetchDecoratedPopos, profileData]);

  const uploadCoverImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    try {
      const response = await launchImageLibrary(options);
      if (!response.didCancel && response.assets?.length) {
        const file = response.assets[0];
        const formData = new FormData();

        formData.append('files', {
          uri:
            (Platform.OS === 'android'
              ? file.uri
              : file.uri?.replace('file://', '')) || '',
          type: file.type,
          name: file.fileName,
          filename: file.fileName,
        });

        const uploadResult = await upload(formData).unwrap();

        if (uploadResult) {
          updateCoverImage({
            coverImage: Array.isArray(uploadResult) && uploadResult[0]._id,
            id: profileId,
          });

          Toast.show({
            type: 'success',
            text1: 'Cover image updated!',
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { top } = useSafeAreaInsets();

  const onSeeMoreNFT = () => {
    navigate('Nft', { uniqueId: profileData?.unique_id || '' });
  };

  const copyProfileLink = () => {
    Clipboard.setString(`${Config.DAPP_URL}/profile/${profileData?.unique_id}`);

    Toast.show({
      type: 'success',
      text1: 'Copied profile link to clipboard',
      position: 'bottom',
    });
  };

  return (
    <Container>
      <CoverImageContainer
        source={{ uri: profileData?.coverImage?.url || '' }}
        isLoading={isUploading || isUpdating}>
        <CoverImageButtonRow style={{ paddingTop: top + space[2] }}>
          <BackButton onPress={() => goBack()}>
            <Icons.BackArrow
              width={space[6]}
              height={space[6]}
              color={colors.white}
            />
          </BackButton>

          {!isNotMyProfile && (
            <Row>
              <CoverImageButton
                onPress={uploadCoverImage}
                style={{ marginRight: space[2] }}>
                <Icons.Image
                  width={space[5]}
                  height={space[5]}
                  color={colors.white}
                />
              </CoverImageButton>

              <CoverImageButton onPress={() => navigate('Settings')}>
                <Icons.Setting
                  width={space[5]}
                  height={space[5]}
                  color={colors.white}
                />
              </CoverImageButton>
            </Row>
          )}
        </CoverImageButtonRow>

        {isUploading || isUpdating ? (
          <CoverImageLoading size={'large'} color={colors.white} />
        ) : null}
      </CoverImageContainer>

      <View style={styles.fill}>
        <View
          style={{
            paddingHorizontal: space[4],
          }}>
          <ProfilePic profile={profileData} />
          <ProfileInfoRow>
            <View
              style={[
                styles.fill,
                {
                  paddingLeft:
                    profileData?.username && profileData?.username.length < 8
                      ? space[2]
                      : space[0],
                },
              ]}>
              <H2 fontWeight="bold" numberOfLines={1}>
                {profileData?.username || ''}
              </H2>

              <SmallBody color={colors.grey[1]} numberOfLines={1}>
                {profileData?.yourselfDescription || ''}
              </SmallBody>
            </View>

            {isNotMyProfile && profileData && (
              <Row style={[{ justifyContent: 'flex-end' }]}>
                <FollowButton
                  onPress={handleOnToggleFollow(
                    profileData?._id,
                    followStatus,
                  )}>
                  {isFollowing || isUnfollowing ? (
                    <ActivityIndicator
                      size={'small'}
                      animating
                      color={colors.black[4]}
                    />
                  ) : (
                    <H4 color={colors.black[4]} fontWeight="bold">
                      {followStatus ? 'Following' : 'Follow'}
                    </H4>
                  )}
                </FollowButton>
                <CopyButton onPress={copyProfileLink}>
                  <Icons.Copy
                    width={space[5]}
                    height={space[5]}
                    color={colors.white}
                  />
                </CopyButton>
              </Row>
            )}
          </ProfileInfoRow>
        </View>

        <StatRow>
          <Stat
            label="Follow"
            value={profileData?.totalFollowings || 0}
            onClick={() =>
              navigate('Following', {
                profileId: profileId,
                tab: 2,
              })
            }
          />
          <Stat
            label="Follower"
            value={profileData?.totalFollowers || 0}
            onClick={() =>
              navigate('Following', {
                profileId: profileId,
                tab: 1,
              })
            }
          />
          <Stat
            label="Post"
            value={profileData?.totalPosts || 0}
            onClick={() => {
              navigate('ActiveActivity', {
                profileId: profileId,
                active: ActivityScreen.POST,
              });
            }}
          />
          <Stat
            label="Tags"
            value={profileData?.totalTagFollowings || 0}
            isLast
            onClick={() =>
              navigate('Following', {
                profileId: profileId,
                tab: 3,
              })
            }
          />
        </StatRow>

        <ScrollView
          style={styles.fill}
          contentContainerStyle={{ paddingBottom: space[10] }}
          showsVerticalScrollIndicator={false}>
          <Row style={{ paddingTop: space[8], paddingHorizontal: space[4] }}>
            <SmallLabel color={colors.grey[1]} style={styles.fill}>
              LINK
            </SmallLabel>
            <Row style={{ flex: 6, gap: space[1] }}>
              <ButtonInfo icon={<Icons.GlobeIcon />} label="Notion" />
              <ButtonInfo icon={<Icons.Twitter />} label="Twitter" />
            </Row>
          </Row>

          <Row style={{ paddingTop: space[5], paddingHorizontal: space[4] }}>
            <SmallLabel color={colors.grey[1]} style={styles.fill}>
              Region
            </SmallLabel>
            <Row style={{ flex: 6 }}>
              <ButtonInfo
                icon={<Icons.Marker />}
                label={RNLocalize.getCountry() || ''}
              />
            </Row>
          </Row>

          <StatisticContainer>
            <TimeStat
              label="Joined"
              value={dayjs(profileData?.createdAt).format('MMM DD, YYYY')}
            />
            <TimeStat
              label="Latest Post"
              value={dayjs(profileData?.updatedAt).format('MMM DD, YYYY')}
            />
            <TimeStat
              label="Seen"
              value={dayjs(profileData?.updatedAt).format('MMM DD, YYYY')}
              isLast
            />
          </StatisticContainer>

          {/* Admin */}

          {admins && <AdminSection data={admins} />}

          {/* Contribute */}

          {contributors && <ContributeSection data={contributors} />}

          {/* Link */}

          {links && <TopLinkSection data={links} />}

          {/* Tags */}
          {tags && <TopTagSection data={tags} isLoading={isTagFetching} />}

          {/* Most liked */}
          {mostLikedUsers && <MostLikedSection data={mostLikedUsers} />}

          {/* <NFTItem /> */}
          {dataNft && (
            <NFTSection
              data={dataNft}
              isLoading={isFetchDataLoading}
              onClickSeeMore={onSeeMoreNFT}
            />
          )}
          {/* Latest post */}
          {latestPosts && (
            <LatestPostSection
              data={latestPosts}
              onClickViewAll={() => {
                navigate('Activities', {
                  profileId: profileId,
                });
              }}
            />
          )}
        </ScrollView>
      </View>
    </Container>
  );
};

export default ProfileDetail;

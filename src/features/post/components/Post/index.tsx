import Share from 'react-native-share';
import { Icons } from '@/assets';
import { H3, H5, H4, H2, LargeLabel } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Switch,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Pressable, View } from 'react-native/';
import {
  useAddBookMarkMutation,
  useBlockUserMutation,
  useDeletePostMutation,
  useDislikePostMutation,
  useLikePostMutation,
  useReasonPostMutation,
  useRemoveBookMarkMutation,
  useReportPostMutation,
  useUnDislikePostMutation,
  useUnlikePostMutation,
} from '../../slice/api';
import { IPost } from '../../types/Post';
import { convertPostData } from '../../utils/convertPostData';
import PostAuthor from './PostAuthor';
import VoteStars from './VoteStars';
import Config from 'react-native-config';
import React from 'react';
import Attachments from './Attachments';
import UrlPreview from '@/components/UrlPreview';
import Votes from './Votes';
import BottomSheet from '@/components/BottomSheet';
import IconButton from '@/components/IconButton';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import ActionModal from './ActionModal';
import ReportBottomSheet from './ReportBottomSheet';
import debounce from '@/utils/debounce';
import TagLocation from './TagLocation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { ViewProps } from 'react-native';
import Button from '@/components/Button';
import { usePublishDraftPostMutation } from '@/features/profile/slice/api';
import QuotePost from './QuotePost';
import { IReports } from '@/features/dao/types';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from '@/components/Modal';
import BtnSubmit from '@/components/BtnSubmit';
import Toast from 'react-native-toast-message';

type PostMode = 'Trending' | 'Post';

const Container = styled.View<{
  mode: 'fullHeight' | 'normal';
}>(({ theme: { colors, space }, mode }) => ({
  backgroundColor: colors.palette.black[2],
  borderRadius: 10,
  paddingVertical: mode === 'fullHeight' ? space[4] : space[6],
}));

const Header = styled(View)(({ theme: { space, horizontalSpace } }) => ({
  marginBottom: space[4],
  paddingHorizontal: horizontalSpace[4],
}));

const IconBox = styled(Pressable)(({ theme: { space, horizontalSpace } }) => ({
  position: 'absolute',
  top: space[3],
  right: horizontalSpace[4],
}));

const Tags = styled(View)(({ theme: { space } }) => ({
  flexDirection: 'row',
  gap: space[1],
  flexWrap: 'wrap',
}));

const TagsItem = styled(H4)(({ theme: { colors } }) => ({
  color: colors.palette.lightGreen,
}));

const Actions = styled(View)<{
  mode?: PostMode;
}>(({ theme: { space, horizontalSpace }, mode = 'post' }) => ({
  flexDirection: 'row',
  gap: horizontalSpace[4],
  marginTop: mode === 'post' ? space[5] : space[2],
  alignItems: 'center',
}));

const ActionItem = styled(TouchableOpacity)(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[1],
}));

const BookMarkBox = styled(TouchableOpacity)(() => ({
  position: 'absolute',
  right: 0,
}));

const CountText = styled(H5)<{
  active?: boolean;
}>(({ theme: { colors }, active }) => ({
  color: !active ? colors.palette.black[1] : colors.white,
}));

const Body = styled(View)(() => ({
  justifyContent: 'space-between',
  flex: 1,
}));

const Box = styled(View)(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
}));

const UrlPreviewContainer = styled(View)(({ theme: { space } }) => ({
  height: space[25],
}));

const BoxPostNow = styled(View)(({ theme: { horizontalSpace } }) => ({
  paddingHorizontal: horizontalSpace[4],
  alignItems: 'flex-end',
}));

const PostNowBtn = styled(Button)(
  ({ theme: { space, borderRadius, horizontalSpace } }) => ({
    borderRadius: borderRadius.medium,
    height: space[10],
    width: horizontalSpace[31],
    marginTop: space[4],
  }),
);

const TitleRp = styled(H4)(({ theme: { colors } }) => ({
  color: colors.black[0],
}));

const ItemRq = styled(H5)(({ theme: { colors, space } }) => ({
  color: colors.black[0],
  paddingTop: space[4],
}));

const ViewRq = styled(View)(
  ({ theme: { horizontalSpace, colors, space } }) => ({
    marginTop: space[4],
    padding: horizontalSpace[2],
    backgroundColor: colors.lightGreen,
  }),
);

const CustomGradientBg = styled(LinearGradient)(
  ({ theme: { space, sizes } }) => ({
    height: space[25],
    borderTopLeftRadius: sizes[3],
    borderTopRightRadius: sizes[3],
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

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
  alignItems: 'center',
}));

const SubDescription = styled(H5)(({ theme: { colors } }) => ({
  color: colors.black[0],
  textAlign: 'center',
  width: '100%',
}));

const HeaderText = styled(H2)(({ theme: { colors, space } }) => ({
  color: colors.palette.black[3],
  fontWeight: 'bold',
  paddingTop: space[5],
  width: '50%',
  textAlign: 'center',
}));

const Hidden = styled.View(({ theme: { colors } }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 2,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.blackTransparent,
  borderRadius: 10,
}));

const TextBlock = styled(H3)(({ theme: { colors, space } }) => ({
  color: colors.white,
  paddingTop: space[2],
}));

const IconItem = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: horizontalSpace[5],
}));

const BoxQuote = styled(Box)(({ theme: { space } }) => ({
  marginTop: space[2],
}));

const TextBtn = styled(LargeLabel)(({ theme: { colors } }) => ({
  color: colors.black[0],
}));

const BtnDetailReason = styled.Pressable(
  ({ theme: { horizontalSpace, space, colors, borderRadius } }) => ({
    width: horizontalSpace[34],
    height: space[11],
    backgroundColor: colors.white,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[6],
  }),
);

interface Props extends ViewProps {
  postData: IPost;
  mode?: PostMode;
  blind?: { isBlind: boolean; reports: IReports[] };
  onDeletePost?: () => void;
  onPostDraft?: (id: string) => void;
  mediaContainerStyle?: ViewStyle;
  onPressCategoryFilter?: (categoryId: string) => void;
}

export const HTMLContent = React.memo(function ({
  html,
  onSeeMorePress,
  mode,
  numberOfLines,
}: {
  html: string;
  onSeeMorePress?: (
    href: string,
    htmlAttribs: Record<string, string>,
    mode: PostMode,
  ) => void;
  mode: PostMode;
  numberOfLines?: number;
}) {
  const { colors, window } = useTheme();
  return (
    <RenderHtml
      contentWidth={window.width}
      source={{ html }}
      defaultTextProps={{
        numberOfLines,
      }}
      renderersProps={{
        a: {
          onPress: (_, href, attributes) => {
            if (onSeeMorePress) {
              onSeeMorePress(href, attributes, mode);
            }
          },
        },
      }}
      classesStyles={{
        'more-button': {
          color: colors.palette.white,
          textDecorationLine: 'none',
          fontWeight: mode === 'Trending' ? '500' : 'bold',
        },
      }}
      tagsStyles={{
        p: {
          margin: 0,
          padding: 0,
        },
      }}
      // eslint-disable-next-line react-native/no-inline-styles
      baseStyle={{
        color: colors.palette.black[1],
        fontSize: mode === 'Trending' ? 12 : 13,
      }}
    />
  );
});

export type ModalTye = 'Delete' | 'Report' | 'Block';
const debouncingTime = 2000;
const Post = ({
  postData,
  mode = 'Post',
  blind,
  onDeletePost,
  onPostDraft,
  style,
  mediaContainerStyle,
  onPressCategoryFilter,
}: Props) => {
  const {
    reviewCategories,
    commentCount,
    isLike,
    isBookmarked,
    tags,
    likeCount,
    reviewRating,
    isDislike,
    dislikeCount,
    poll,
    yourVote,
    isBlind,
  } = postData;
  const [
    deletePost,
    { isLoading: deletePostLoading, isSuccess: deletePostSuccess },
  ] = useDeletePostMutation();
  const [
    reportPost,
    { isLoading: reportPostLoading, isSuccess: reportSuccess },
  ] = useReportPostMutation();
  const [
    reasonPost,
    { isLoading: reasonPostLoading, isSuccess: reasonSuccess },
  ] = useReasonPostMutation();

  const [
    blockUser,
    { isLoading: blockUserLoading, isSuccess: blockUserSuccess },
  ] = useBlockUserMutation();
  const userInfo = useAppSelector(getUserInfo);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [openReportBottomSheet, setOpenReportBottomSheet] = useState(false);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalTye>('Delete');

  const [isLikedPost, setLikedPost] = useState(isLike);
  const [likeCountPost, setLikeCountPost] = useState(likeCount);

  const [isDisLikedPost, setIsDisLikedPost] = useState(isDislike);
  const [dislikeCountPost, setDisLikeCountPost] = useState(dislikeCount || 0);

  const [isBookMarkedPost, setIsBookMarkedPost] = useState(isBookmarked);
  const [modalLoading, setModalLoading] = useState(false);

  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();

  const { colors, space, window, horizontalSpace } = useTheme();
  const { textHtml, newMedias, shortContent, links } = convertPostData(
    postData,
    mode,
  );
  const [isContentShowAll, setIsContentShowAll] = useState(false);
  const [swBlind, setSwBlind] = useState(blind?.isBlind || false);
  const [showPostNow, setShowPostNow] = useState<boolean>(false);

  const [likePost, { isLoading: likePostLoading }] = useLikePostMutation();
  const [unlikePost, { isLoading: unlikePostLoading }] =
    useUnlikePostMutation();

  const [dislikePost, { isLoading: dislikePostLoading }] =
    useDislikePostMutation();
  const [unDislikePost, { isLoading: unDislikePostLoading }] =
    useUnDislikePostMutation();

  const [addBookMark, { isLoading: addBookMarkLoading }] =
    useAddBookMarkMutation();

  const [removeBookMark, { isLoading: removeBookMarkLoading }] =
    useRemoveBookMarkMutation();

  const [postDraft, { isLoading: isLoadingPostDraft }] =
    usePublishDraftPostMutation();

  const handleToggleLikePost = useCallback(async () => {
    if (likePostLoading || unlikePostLoading) {
      return;
    }
    try {
      if (isLikedPost) {
        setLikedPost(false);
        setLikeCountPost(likeCountPost - 1);
        await unlikePost(postData.id).unwrap();
      } else {
        setLikedPost(true);
        setLikeCountPost(likeCountPost + 1);
        if (isDisLikedPost) {
          setIsDisLikedPost(false);
          setDisLikeCountPost(dislikeCountPost - 1);
        }
        await likePost(postData.id).unwrap();
      }
    } catch {
      setLikedPost(isLikedPost);
      setLikeCountPost(likeCountPost);
      if (!isLikedPost) {
        setIsDisLikedPost(isDisLikedPost);
        setDisLikeCountPost(dislikeCountPost);
      }
    }
  }, [
    likePostLoading,
    unlikePostLoading,
    isLikedPost,
    likeCountPost,
    unlikePost,
    postData.id,
    dislikeCountPost,
    likePost,
    isDisLikedPost,
  ]);

  const handleToggleDislikePost = useCallback(async () => {
    if (dislikePostLoading || unDislikePostLoading) {
      return;
    }
    try {
      if (isDisLikedPost) {
        setIsDisLikedPost(false);
        setDisLikeCountPost(dislikeCountPost - 1);
        await unDislikePost(postData.id).unwrap();
      } else {
        setIsDisLikedPost(true);
        setDisLikeCountPost(dislikeCountPost + 1);
        if (isLikedPost) {
          setLikedPost(false);
          setLikeCountPost(likeCountPost - 1);
        }
        await dislikePost(postData.id).unwrap();
      }
    } catch {
      setIsDisLikedPost(isDisLikedPost);
      setDisLikeCountPost(dislikeCountPost);
      if (!isDisLikedPost) {
        setLikedPost(isLikedPost);
        setLikeCountPost(likeCountPost);
      }
    }
  }, [
    dislikeCountPost,
    dislikePost,
    dislikePostLoading,
    isDisLikedPost,
    isLikedPost,
    likeCountPost,
    postData.id,
    unDislikePost,
    unDislikePostLoading,
  ]);

  const toggleBookMark = useCallback(
    (type: 'remove' | 'add', id: string) => {
      if (type === 'remove') {
        removeBookMark(id);
      } else {
        addBookMark(id);
      }
    },
    [addBookMark, removeBookMark],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceToggleBookMark = useCallback(
    debounce(toggleBookMark, debouncingTime),
    [toggleBookMark],
  );

  const handleToggleBookMark = useCallback(async () => {
    if (isBookMarkedPost) {
      setIsBookMarkedPost(false);
      debounceToggleBookMark('remove', postData.id);
    } else {
      setIsBookMarkedPost(true);
      debounceToggleBookMark('add', postData.id);
    }
  }, [isBookMarkedPost, debounceToggleBookMark, postData.id]);

  const handleSharePress = useCallback(() => {
    Share.open({
      url: Config.DAPP_URL + '/community/post/' + postData.id,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  }, [postData.id]);

  const htmlContent = useMemo(() => {
    return mode === 'Post' && isContentShowAll ? textHtml : shortContent || '';
  }, [isContentShowAll, textHtml, shortContent, mode]);

  const handleOnSeeMore = useCallback(
    (href: string, attributes: Record<string, string>, mode: PostMode) => {
      if (mode === 'Trending') {
        navigate('PostDetails', { post: postData });
        return;
      }

      if (attributes.id === 'more-button') {
        setIsContentShowAll(true);
      } else if (attributes.id === 'less-button') {
        setIsContentShowAll(false);
      } else {
        Linking.openURL(href);
      }
    },
    [postData],
  );

  const ButtonActionsLoading = useMemo(() => {
    return (
      deletePostLoading ||
      blockUserLoading ||
      reportPostLoading ||
      reasonPostLoading
    );
  }, [
    blockUserLoading,
    deletePostLoading,
    reportPostLoading,
    reasonPostLoading,
  ]);

  const handleCloseBottomSheet = useCallback(() => {
    if (!ButtonActionsLoading) {
      setOpenBottomSheet(false);
    }
  }, [ButtonActionsLoading]);

  const handleOpenBottomSheet = useCallback(() => {
    setOpenBottomSheet(true);
  }, []);

  const handleCloseReportBottomSheet = useCallback(() => {
    setOpenReportBottomSheet(false);
    setReason('');
  }, []);
  const handleReasonChange = useCallback((val: string) => {
    setReason(val);
  }, []);
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);
  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const numberOfLines = useMemo(() => {
    if (mode === 'Trending') {
      if (newMedias.length > 0) {
        return 2;
      } else if (links.length > 0) {
        return 4;
      }
    }
  }, [links.length, mode, newMedias.length]);

  const handleDeletePost = useCallback(async () => {
    if (!modalLoading) {
      try {
        setModalLoading(true);
        await deletePost({
          postId: postData.id,
        });
        Toast.show({
          type: '_success',
          text1: 'Success',
          text2: 'Delete post successfully',
          position: 'bottom',
        });
        handleCloseModal();
      } catch {
        Toast.show({
          type: '_error',
          text1: 'Error',
          text2: 'Some thing wrong!',
          position: 'bottom',
        });
      }
      setModalLoading(false);
    }
  }, [deletePost, handleCloseModal, modalLoading, postData.id]);

  const handleBlock = useCallback(async () => {
    if (!modalLoading) {
      try {
        setModalLoading(true);
        await blockUser({
          blocked: postData.profile?.id,
        });
        Toast.show({
          type: '_success',
          text1: `Block ${postData.profile.username} successfully`,
          position: 'bottom',
        });
        handleCloseModal();
      } catch {
        Toast.show({
          type: '_error',
          text1: 'Error',
          text2: 'Some thing wrong!',
          position: 'bottom',
        });
      }
      setModalLoading(false);
    }
  }, [
    blockUser,
    handleCloseModal,
    modalLoading,
    postData.profile?.id,
    postData.profile.username,
  ]);

  const handleReportPost = useCallback(async () => {
    if (!modalLoading) {
      try {
        setModalLoading(true);
        if (blind) {
          await reasonPost({
            id: postData.id,
            status: true,
            reason,
          });
          setSwBlind(true);
        } else {
          await reportPost({
            postId: postData.id,
            reason,
          });
        }
        Toast.show({
          type: '_success',
          text1: 'Success',
          text2: 'Report post successfully',
          position: 'bottom',
        });
        handleCloseReportBottomSheet();
        setReason('');
      } catch {
        Toast.show({
          type: '_error',
          text1: 'Error',
          text2: 'Some thing wrong!',
          position: 'bottom',
        });
      }
      setModalLoading(false);
    }
  }, [
    modalLoading,
    blind,
    handleCloseReportBottomSheet,
    reasonPost,
    postData.id,
    reason,
    reportPost,
  ]);

  const handleConfirmBlind = () => {
    setShowModal(false);
    reasonPost({
      id: postData.id,
      status: false,
      reason: '',
    });
    setSwBlind(false);
  };

  const handlePostNow = useCallback(async () => {
    try {
      setShowPostNow(false);
      await postDraft({ postId: postData?.id });
      onPostDraft && onPostDraft(postData?.id);
    } catch (err: any) {}
  }, [postData?.id, postDraft, onPostDraft]);

  const onToggleBlind = () => {
    if (!swBlind) {
      setOpenReportBottomSheet(true);
    } else {
      setShowModal(true);
    }
  };

  const onModifyPost = useCallback(() => {
    navigate('CreatePost', { data: postData });
    setOpenBottomSheet(false);
  }, [navigate, postData]);

  const renderButtons = useMemo(() => {
    return (
      <View>
        {!ButtonActionsLoading ? (
          userInfo?.profile?.id === postData.profile?.id ? (
            <>
              <IconButton
                onPress={onModifyPost}
                LeftIcon={Icons.ReloadIcon}
                label="Modify"
              />
              <IconButton
                onPress={() => {
                  setModalType('Delete');
                  handleOpenModal();
                }}
                LeftIcon={Icons.DeleteIcon}
                label="Delete"
              />
            </>
          ) : (
            <>
              <IconButton
                onPress={async () => {
                  setModalType('Block');
                  handleOpenModal();
                }}
                LeftIcon={Icons.BlockIcon}
                label={'Block ' + (postData?.profile?.username || 'user')}
              />
              <IconButton
                onPress={async () => {
                  setOpenReportBottomSheet(true);
                }}
                LeftIcon={Icons.WarningIcon}
                label="Report post"
              />
            </>
          )
        ) : (
          <View>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  }, [
    ButtonActionsLoading,
    handleOpenModal,
    onModifyPost,
    postData.profile?.id,
    postData.profile?.username,
    userInfo?.profile?.id,
  ]);

  useEffect(() => {
    if (deletePostSuccess) {
      onDeletePost && onDeletePost();
    }
  }, [deletePostSuccess, onDeletePost]);

  useEffect(() => {
    if (blockUserSuccess) {
      onDeletePost && onDeletePost();
    }
  }, [blockUserSuccess, onDeletePost]);

  useEffect(() => {
    if (reportSuccess || reasonSuccess) {
      handleCloseBottomSheet();
    }
  }, [handleCloseBottomSheet, reportSuccess, reasonSuccess]);

  const likeButtonDisabled =
    dislikePostLoading ||
    unDislikePostLoading ||
    likePostLoading ||
    unlikePostLoading;
  return (
    <>
      {isBlind && (
        <Hidden>
          <Icons.BlockEye />
          <TextBlock fontWeight="bold">Your post is blinded</TextBlock>
          <BtnDetailReason>
            <TextBtn fontWeight="bold">Detail reason</TextBtn>
          </BtnDetailReason>
        </Hidden>
      )}
      <Container mode={mode === 'Post' ? 'normal' : 'fullHeight'} style={style}>
        <Header>
          <PostAuthor
            dao={postData?.dao}
            profile={postData?.profile}
            createdAt={postData?.createdAt}
          />
          <IconBox onPress={handleOpenBottomSheet} hitSlop={8}>
            {blind ? (
              <TouchableOpacity onPress={onToggleBlind}>
                <Switch
                  trackColor={{
                    false: colors.grey[1],
                    true: colors.blackYellow,
                  }}
                  thumbColor={swBlind ? colors.lightGreen : '#f4f3f4'}
                  ios_backgroundColor={colors.blackYellow}
                  value={swBlind}
                  disabled
                />
              </TouchableOpacity>
            ) : (
              <Icons.HorizontalDotsIcon />
            )}
          </IconBox>
        </Header>
        <Body>
          <View>
            <Box>
              {reviewCategories.length > 0 && mode === 'Post' && (
                <VoteStars
                  voteScore={reviewRating}
                  voteCategory={reviewCategories}
                  onPressCategoryFilter={onPressCategoryFilter}
                />
              )}
              {postData.title ? (
                mode === 'Post' ? (
                  <H3 numberOfLines={1} fontWeight="bold">
                    {postData.title}
                  </H3>
                ) : (
                  <H4 numberOfLines={1} fontWeight="bold">
                    {postData.title}
                  </H4>
                )
              ) : (
                <></>
              )}
              <HTMLContent
                numberOfLines={numberOfLines}
                mode={mode}
                html={htmlContent}
                onSeeMorePress={handleOnSeeMore}
              />
            </Box>
          </View>
          <View>
            {postData.location && mode === 'Post' && (
              <TagLocation
                mapUrl={postData.mapLocation?.url}
                location={postData.location}
                showMap={newMedias.length === 0 && links.length === 0}
              />
            )}
            {newMedias.length > 0 && (
              <Attachments
                mode={mode === 'Post' ? 'carousel' : 'normal'}
                data={newMedias}
                style={
                  mediaContainerStyle || {
                    width: window.width - horizontalSpace[8],
                  }
                }
              />
            )}
            {newMedias.length === 0 &&
              links.length > 0 &&
              typeof links[links.length - 1].link === 'string' && (
                <UrlPreviewContainer>
                  <UrlPreview url={links[links.length - 1].link!} />
                </UrlPreviewContainer>
              )}
            <Box>
              {poll && mode === 'Post' && (
                <Votes votedOption={yourVote?.voteOption} data={poll} />
              )}
            </Box>
            {mode === 'Post' && postData.rePost && (
              <BoxQuote>
                <QuotePost data={postData.rePost} />
              </BoxQuote>
            )}
            <Box>
              {tags && tags.length > 0 && (
                <Tags>
                  {tags.map(item => {
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() =>
                          navigate('SearchDetail', {
                            searchContent: item.content,
                          })
                        }>
                        <TagsItem>{item.content}</TagsItem>
                      </Pressable>
                    );
                  })}
                </Tags>
              )}
            </Box>
            {postData?.status === 'draft' ? (
              <BoxPostNow>
                <PostNowBtn
                  text="Post Now"
                  onPress={() => setShowPostNow(true)}
                  loading={isLoadingPostDraft}
                  disabled={isLoadingPostDraft}
                  colorLoading={colors.black[0]}
                />
              </BoxPostNow>
            ) : (
              <Box>
                <Actions mode={mode}>
                  <ActionItem
                    hitSlop={8}
                    onPress={() => navigate('CreatePost', { post: postData })}>
                    <Icons.Quotes />
                  </ActionItem>
                  <ActionItem
                    hitSlop={8}
                    onPress={() => navigate('PostDetails', { post: postData })}>
                    <Icons.CommentIcon />
                    <CountText fontWeight="medium">{commentCount}</CountText>
                  </ActionItem>
                  <ActionItem
                    hitSlop={8}
                    disabled={likeButtonDisabled}
                    onPress={handleToggleLikePost}>
                    <IconItem>
                      <Icons.LikeIcon
                        color={
                          isLikedPost
                            ? colors.palette.lightGreen
                            : colors.palette.black[1]
                        }
                      />
                    </IconItem>
                    <CountText fontWeight="medium" active={isLikedPost}>
                      {likeCountPost}
                    </CountText>
                  </ActionItem>
                  <ActionItem
                    hitSlop={8}
                    disabled={likeButtonDisabled}
                    onPress={handleToggleDislikePost}>
                    <Icons.UnLikeIcon
                      color={
                        isDisLikedPost
                          ? colors.palette.alertRed
                          : colors.palette.black[1]
                      }
                    />
                    <CountText fontWeight="medium" active={isDisLikedPost}>
                      {dislikeCountPost}
                    </CountText>
                  </ActionItem>
                  <ActionItem hitSlop={8} onPress={handleSharePress}>
                    <Icons.ShareIcon />
                  </ActionItem>
                  <BookMarkBox
                    hitSlop={8}
                    disabled={addBookMarkLoading || removeBookMarkLoading}
                    onPress={handleToggleBookMark}>
                    <Icons.BookMark
                      color={
                        isBookMarkedPost
                          ? colors.palette.lightGreen
                          : colors.palette.black[1]
                      }
                    />
                  </BookMarkBox>
                </Actions>
              </Box>
            )}
          </View>
          {blind && (
            <ViewRq>
              <TitleRp fontWeight="bold">Problem</TitleRp>
              {blind?.reports.map((e, index) => (
                <ItemRq key={index}>{e?.reason}</ItemRq>
              ))}
            </ViewRq>
          )}
        </Body>
        {!openReportBottomSheet && !openModal && (
          <BottomSheet
            isVisible={openBottomSheet}
            closeModal={handleCloseBottomSheet}
            showDivider={false}
            renderButtons={renderButtons}
          />
        )}
        {openModal && (
          <ActionModal
            loading={modalLoading}
            author={postData?.profile?.username || 'user'}
            onCloseModal={handleCloseModal}
            open={openModal}
            onDeletePost={handleDeletePost}
            onReportPost={handleReportPost}
            onBlock={handleBlock}
            modalType={modalType}
          />
        )}
        {openReportBottomSheet && (
          <ReportBottomSheet
            loading={modalLoading}
            open={openReportBottomSheet}
            onClose={handleCloseReportBottomSheet}
            onSubmit={handleReportPost}
            onChangeText={handleReasonChange}
            textValue={reason}
            isBlinding={blind ? blind.isBlind : false}
          />
        )}
        <CustomModal
          onClose={() => setShowModal(false)}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          isVisible={showModal}
          headerContent={<HeaderModal title="Cancel Blind" />}
          bodyContent={
            <BodyContainer>
              <Item>
                <SubDescription>
                  Do you want to cancel blind this post?
                </SubDescription>
              </Item>
              <BtnSubmit
                bg={colors.black[0]}
                styleLabel={{ color: colors.white }}
                label="Confirm"
                onPress={handleConfirmBlind}
              />
              <BtnSubmit
                bg={colors.white}
                styleLabel={{ color: colors.black[0] }}
                label="Cancel"
                onPress={() => setShowModal(false)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ borderWidth: 1, marginTop: -space[5] }}
              />
            </BodyContainer>
          }
        />
        <CustomModal
          onClose={() => setShowPostNow(false)}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          isVisible={showPostNow}
          headerContent={<HeaderModal title="Publish this post now" />}
          bodyContent={
            <BodyContainer>
              <BtnSubmit
                bg={colors.black[0]}
                styleLabel={{ color: colors.white }}
                label="OK"
                onPress={handlePostNow}
              />
              <BtnSubmit
                bg={colors.white}
                styleLabel={{ color: colors.black[0] }}
                label="Cancel"
                onPress={() => setShowPostNow(false)}
                style={{ borderWidth: 1, marginTop: -space[5] }}
              />
            </BodyContainer>
          }
        />
      </Container>
    </>
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

export default Post;

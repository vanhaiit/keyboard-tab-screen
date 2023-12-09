import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

import Header from '@/components/Header';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import Post from '../components/Post';
import { CreatedAt, UserName } from '../components/Post/PostAuthor';
import RenderHtml from 'react-native-render-html';
import Avatar from '@/features/profile/components/Avatar';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RichEditor } from 'react-native-pell-rich-editor';
import { H4, H5 } from '@/components/Typography';
import {
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetCommentsQuery,
  useSendCommentMutation,
} from '../slice/api';
import { Comment } from '../types/Post';

import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { fromNow } from '@/utils/formatDate';
import Row from '@/components/Row';
import { Icons } from '@/assets';
import { useDispatch } from 'react-redux';
import {
  getCurrentEditing,
  getCurrentReply,
  setEditingComment,
  setReplyTo,
} from '../slice';
import useKeyboard from '@/hooks/useKeyboard';

type CommentTree = {
  comment: Comment;
  replyComments: {
    comment: Comment;
    replyComments: Comment[];
  }[];
};

const CommentItem = ({
  data,
  parentComment,
}: {
  data: Comment;
  parentComment?: Comment;
}) => {
  const { space, colors, window } = useTheme();

  const userInfo = useAppSelector(getUserInfo);
  const currentReplyTo = useAppSelector(getCurrentReply);
  const dispatch = useDispatch();
  const [requestDeleteComment] = useDeleteCommentMutation();

  const setReplyToComment = () => {
    if (parentComment) {
      dispatch(setReplyTo(parentComment));
    } else {
      dispatch(setReplyTo(data));
    }
  };

  const deleteComment = () => {
    requestDeleteComment({
      id: data.id,
    });
  };

  const focusComment = () => {
    dispatch(setEditingComment(data));
  };

  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'PostDetails'>>();

  const onProfileImagePress = () => {
    if (userInfo?.profile?._id === data.owner?._id) {
      navigate('Profile');
    } else {
      navigate('ProfileDetail', { profileId: data.owner?._id });
    }
  };

  const createdTime = useMemo(() => {
    return fromNow(data.createdAt);
  }, [data]);

  const htmlBaseStyle = useMemo(
    () => ({
      color: colors.white,
      fontSize: 13,
      lineHeight: 20,
    }),
    [colors],
  );

  return (
    <CommentWrapper>
      <Pressable onPress={onProfileImagePress}>
        <OwnerAvatar profile={data?.owner} />
      </Pressable>
      <CommentRightColumn>
        <UserName style={{ paddingBottom: space[1] }} fontWeight="bold">
          {data?.owner?.username}
        </UserName>
        <CreatedAt fontWeight="medium">{createdTime}</CreatedAt>

        <CommentContentWrapper>
          <RenderHtml
            contentWidth={window.width * 0.8}
            source={{ html: data.content }}
            baseStyle={htmlBaseStyle}
            tagsStyles={{
              a: {
                color: colors.lightGreen,
                fontWeight: '500',
                textDecorationColor: colors.lightGreen,
              },
            }}
          />

          <CommentCTARow>
            <CommentCTA onPress={setReplyToComment}>
              <Row>
                <Icons.Reply
                  width={space[5]}
                  height={space[5]}
                  color={
                    currentReplyTo?.id === data.id
                      ? colors.lightGreen
                      : colors.grey[1]
                  }
                />
                <H4
                  style={{ marginLeft: space[1] }}
                  color={
                    currentReplyTo?.id === data.id
                      ? colors.lightGreen
                      : colors.grey[1]
                  }
                  fontWeight={
                    currentReplyTo?.id === data.id ? 'bold' : 'normal'
                  }>
                  {data.totalReply}
                </H4>
              </Row>
            </CommentCTA>
            {data.owner._id === userInfo?.profile?._id && (
              <Row>
                <CommentCTA onPress={focusComment}>
                  <Icons.Edit2
                    width={space[5]}
                    height={space[5]}
                    color={colors.grey[1]}
                  />
                </CommentCTA>

                <CommentCTA onPress={deleteComment}>
                  <Icons.DeleteIcon
                    width={space[5]}
                    height={space[5]}
                    color={colors.grey[1]}
                  />
                </CommentCTA>
              </Row>
            )}
          </CommentCTARow>
        </CommentContentWrapper>
      </CommentRightColumn>
    </CommentWrapper>
  );
};

const CommentNode = ({
  item,
}: {
  item: {
    comment: Comment;
    replyComments: Comment[];
  };
}) => {
  const { styles, horizontalSpace, space, colors } = useTheme();
  const [displayReplies, setDisplayReplies] = useState(false);

  return (
    <View style={[styles.fill]}>
      <CommentItem data={item.comment} />
      {item.comment.totalReply && <VerticalLine />}

      {item.comment.totalReply ? (
        displayReplies ? (
          <FlashList
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            contentContainerStyle={{ paddingLeft: horizontalSpace[10] }}
            data={item.replyComments}
            renderItem={({ item: item2 }) => (
              <CommentItem data={item2} parentComment={item.comment} />
            )}
          />
        ) : (
          <Pressable onPress={() => setDisplayReplies(true)}>
            <Row
              style={{ paddingLeft: horizontalSpace[7], marginTop: space[4] }}>
              <Icons.Reply2
                width={space[4]}
                height={space[4]}
                color={colors.lightGreen}
              />

              <ReplyCount fontWeight="bold" color={colors.lightGreen}>
                Reply ({item.comment.totalReply})
              </ReplyCount>
            </Row>
          </Pressable>
        )
      ) : null}
    </View>
  );
};

const CommentTree = memo(
  ({ item, isLast }: { item: CommentTree; isLast?: boolean }) => {
    const { space, colors, horizontalSpace } = useTheme();
    const [displayReplies, setDisplayReplies] = useState(false);

    const renderReplyComments = useCallback(() => {
      if (!item.comment.totalReply) {
        return null;
      }

      return (
        <ReplyWrapper>
          {displayReplies ? (
            <FlashList
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              estimatedItemSize={200}
              contentContainerStyle={{ paddingLeft: horizontalSpace[10] }}
              data={item.replyComments}
              renderItem={({ item: _item }) => <CommentNode item={_item} />}
            />
          ) : (
            <Pressable onPress={() => setDisplayReplies(true)}>
              <Row
                style={{
                  paddingLeft: horizontalSpace[7],
                  marginTop: space[4],
                }}>
                <Icons.Reply2
                  width={space[4]}
                  height={space[4]}
                  color={colors.lightGreen}
                />

                <ReplyCount fontWeight="bold" color={colors.lightGreen}>
                  Reply ({item.comment.totalReply})
                </ReplyCount>
              </Row>
            </Pressable>
          )}
        </ReplyWrapper>
      );
    }, [colors, displayReplies, horizontalSpace, item, space]);

    return (
      <CommentTreeWrapper isLast={isLast}>
        <CommentItem data={item.comment} />
        {item.comment.totalReply && displayReplies && (
          <VerticalLine bottom={space[4]} left={horizontalSpace[4]} />
        )}
        {renderReplyComments()}
      </CommentTreeWrapper>
    );
  },
);

const PostDetails = () => {
  const { space, colors, window } = useTheme();
  const { params } = useRoute<RouteProp<AppRootParams, 'PostDetails'>>();
  const userInfo = useAppSelector(getUserInfo);
  const currentReplyTo = useAppSelector(getCurrentReply);
  const currentEditing = useAppSelector(getCurrentEditing);

  const dispatch = useDispatch();
  const post = params?.post;

  const [commentInput, setCommentInput] = useState('');
  const richText = useRef<RichEditor>(null);
  const commentListRef = useRef<FlashList<CommentTree>>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const keyboardShown = useKeyboard();

  const { data: allComments } = useGetCommentsQuery(
    {
      _limit: -1,
      _sort: 'createdAt:desc',
      _start: 0,
      status: 'public',
      post: post?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [
    postComment,
    {
      isLoading: isCommentSending,
      isSuccess: sendCommentSuccess,
      data: sendCommentResponse,
    },
  ] = useSendCommentMutation();

  const [requestEditComment, { isLoading: isCommentEditing }] =
    useEditCommentMutation();

  useEffect(() => {
    if (!keyboardShown) {
      dispatch(setReplyTo(null));
      dispatch(setEditingComment(null));
    }
  }, [dispatch, keyboardShown]);

  const editComment = useCallback(async () => {
    if (currentEditing) {
      const payload: Comment = { ...currentEditing, content: commentInput };

      requestEditComment(payload);
      richText.current?.blurContentEditor();
      richText.current?.setContentHTML('');
    }
  }, [commentInput, currentEditing, requestEditComment]);

  const sendComment = useCallback(async () => {
    const payload = {
      content: commentInput,
      post,
      mentionUsers: [],
      shortPlainContent: '',
    };

    if (currentReplyTo) {
      Object.assign(payload, { replyTo: currentReplyTo });
    }

    postComment(payload);
    richText.current?.blurContentEditor();
    richText.current?.setContentHTML('');
  }, [commentInput, currentReplyTo, post, postComment]);

  const handleOnSubmitComment = () => {
    if (currentEditing) {
      editComment();
    } else {
      sendComment();
    }
  };

  const sortCommentByDate = (arr: Comment[]) => {
    return arr.slice().sort((a, b) => {
      return (
        new Date(a?.createdAt).valueOf() - new Date(b?.createdAt).valueOf()
      );
    });
  };

  const groupReplyComments = useCallback(
    (comments: Comment[], secondNode?: boolean) => {
      if (Array.isArray(allComments)) {
        return sortCommentByDate(comments)
          .filter(comment => (!secondNode ? !comment.replyTo : comment))
          .map(c => {
            const replyComments = allComments.filter(
              item => item?.replyTo && item?.replyTo?.id === c?.id,
            );

            let allReplyComments = replyComments.slice();
            if (secondNode) {
              replyComments.forEach(rc => {
                const thirdNodeReplyComments = allComments.filter(
                  item => item?.replyTo && item?.replyTo.id === rc.id,
                );
                allReplyComments = allReplyComments.concat(
                  thirdNodeReplyComments,
                );
              });
            }

            return {
              comment: c,
              replyComments: allReplyComments,
            };
          });
      } else {
        return [];
      }
    },
    [allComments],
  );

  const groupedComments: CommentTree[] = useMemo(() => {
    const firstGroupedComments = Array.isArray(allComments)
      ? groupReplyComments(allComments)
      : [];

    return firstGroupedComments.length
      ? firstGroupedComments.map(item => ({
          ...item,
          replyComments: groupReplyComments(item.replyComments, true),
        }))
      : [];
  }, [allComments, groupReplyComments]);

  useEffect(() => {
    const currentFocusComment = currentReplyTo || currentEditing;
    if (currentFocusComment) {
      richText.current?.focusContentEditor();
      richText.current?.setContentHTML('');
      const commentIndex = groupedComments.findIndex(
        item => item.comment.id === currentFocusComment?.id,
      );

      // really hacky way
      if (commentIndex < 0) {
        let replyCommentIndex = 0;
        const firstNodeIndex = groupedComments.findIndex(item => {
          const secondNodeIndex = item.replyComments.findIndex(
            rc => rc.comment.id === currentFocusComment?.id,
          );
          if (
            item.replyComments[secondNodeIndex]?.comment.id ===
            currentFocusComment?.id
          ) {
            replyCommentIndex =
              secondNodeIndex === 0
                ? secondNodeIndex
                : secondNodeIndex +
                  item.replyComments[secondNodeIndex - 1].replyComments.length +
                  1;
          }
          return (
            item.replyComments[secondNodeIndex]?.comment.id ===
            currentFocusComment?.id
          );
        });

        commentListRef.current?.scrollToIndex({
          index: firstNodeIndex,
          animated: true,
          viewPosition: 0,
          viewOffset: -(replyCommentIndex + 1) * 100,
        });
      } else if (commentIndex >= 0) {
        commentListRef.current?.scrollToIndex({
          index: commentIndex,
          animated: true,
          viewPosition: 0,
        });
      }
    }

    // hacky way to place cursor at the end
    if (currentReplyTo) {
      setTimeout(() => {
        richText.current?.insertHTML(
          `<a style="color: #D6F76B" href="/profile/${currentReplyTo?.owner?.unique_id}" target="_blank">@${currentReplyTo?.owner?.unique_id}</a>`,
        );
      }, 100);
    }
    if (currentEditing) {
      setTimeout(() => {
        richText.current?.insertHTML(currentEditing.content);
      }, 100);
    }
  }, [currentReplyTo, currentEditing, groupedComments]);

  useEffect(() => {
    if (sendCommentSuccess && !sendCommentResponse?.replyTo) {
      setTimeout(() => {
        commentListRef?.current?.scrollToEnd({
          animated: true,
        });
      }, 1000);
    }
  }, [sendCommentSuccess, sendCommentResponse]);

  const scrollToCursorPosition = (offset: number) => {
    scrollViewRef?.current?.scrollTo({ y: offset - 30, animated: true });
  };

  const renderComment: ListRenderItem<CommentTree> = useCallback(
    ({ item, index }) => {
      return (
        <CommentTree
          item={item}
          isLast={index === groupedComments.length - 1}
        />
      );
    },
    [groupedComments],
  );

  const handleEditorChange = (text: string) => {
    setCommentInput(text);
  };

  const handleEditorBlur = () => {
    dispatch(setReplyTo(null));
    dispatch(setEditingComment(null));
  };

  const handleOnScrollDrag = () => {
    richText?.current?.blurContentEditor();
  };

  return (
    <Container edges={['bottom', 'left', 'right']}>
      <Header title={`${post.profile.username}'s comments`} />

      <CommentSection>
        <FlashList
          scrollEventThrottle={16}
          onScrollBeginDrag={handleOnScrollDrag}
          ListHeaderComponent={
            <NoBorderPost
              postData={post}
              mode="Post"
              mediaContainerStyle={{ width: window.width }}
            />
          }
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          ref={commentListRef}
          data={groupedComments}
          renderItem={renderComment}
          estimatedItemSize={200}
        />
      </CommentSection>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <CommentFooter>
          <OwnerAvatar profile={userInfo?.profile} />
          <EditorContainer
            ref={scrollViewRef}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <EditorWrapper>
              <RichEditor
                ref={richText}
                initialFocus={false}
                firstFocusEnd={false}
                editorStyle={{
                  backgroundColor: colors.black[2],
                  color: colors.white,
                  placeholderColor: colors.grey[1],
                  caretColor: colors.white,
                }}
                placeholder={'Enter your comment'}
                pasteAsPlainText
                androidLayerType="software"
                useContainer
                onCursorPosition={scrollToCursorPosition}
                onChange={handleEditorChange}
                onBlur={handleEditorBlur}
                disabled={isCommentSending || isCommentEditing}
              />
            </EditorWrapper>
          </EditorContainer>
          <SendButton
            disabled={!commentInput || isCommentSending || isCommentEditing}
            onPress={handleOnSubmitComment}>
            {isCommentSending || isCommentEditing ? (
              <ActivityIndicator size={'small'} color={colors.grey[1]} />
            ) : (
              <Icons.Send
                width={space[6]}
                height={space[6]}
                color={commentInput ? colors.lightGreen : colors.grey[1]}
              />
            )}
          </SendButton>
        </CommentFooter>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default PostDetails;

const Container = styled(SafeAreaView)(({ theme }) => ({
  backgroundColor: theme.colors.background,
  flex: 1,
}));

const CommentSection = styled.View(({ theme: { space } }) => ({
  paddingBottom: space[4],
  flex: 1,
}));

const SendButton = styled.TouchableOpacity(({ theme: { space } }) => ({
  marginLeft: space[3],
  height: space[10],
  justifyContent: 'center',
  alignItems: 'center',
}));

const OwnerAvatar = styled(Avatar)(({ theme: { space } }) => ({
  backgroundColor: 'transparent',
  width: space[8],
  height: space[8],
}));

const VerticalLine = styled.View<{ bottom?: number; left?: number }>(
  ({ theme: { space, colors, scale }, bottom, left }) => ({
    position: 'absolute',
    top: space[12],
    bottom: bottom || 0,
    maxHeight: '100%',
    width: 1,
    backgroundColor: colors.whiteTransparent[1],
    left: left ? left + scale(17) : scale(17),
  }),
);

const NoBorderPost = styled(Post)(({ theme: { colors, borderRadius } }) => ({
  borderRadius: borderRadius.none,
  backgroundColor: colors.secondary,
  borderBottomWidth: 1,
  borderBottomColor: colors.whiteTransparent[1],
}));

const CommentWrapper = styled.View(({ theme: { space } }) => ({
  flexDirection: 'row',
  width: '100%',
  paddingTop: space[4],
}));

const CommentRightColumn = styled.View(
  ({ theme: { space, horizontalSpace } }) => ({
    flex: 1,
    paddingTop: space[1],
    paddingLeft: horizontalSpace[2],
  }),
);

const CommentContentWrapper = styled.View(({ theme: { space } }) => ({
  paddingTop: space[2],
}));

const CommentCTARow = styled(Row)(({ theme: { space } }) => ({
  marginTop: space[3],
}));

const CommentCTA = styled.TouchableOpacity(({ theme: { space } }) => ({
  marginRight: space[5],
}));

const ReplyWrapper = styled.View(({ theme: {} }) => ({}));

const ReplyCount = styled(H5)(({ theme: { space } }) => ({
  paddingLeft: space[1],
}));

const CommentTreeWrapper = styled.View<{ isLast?: boolean }>(
  ({ theme: { space, colors, horizontalSpace }, isLast }) => ({
    flex: 1,
    borderBottomWidth: !isLast ? 1 : 0,
    borderBottomColor: colors.whiteTransparent[1],
    paddingBottom: space[4],
    paddingHorizontal: horizontalSpace[4],
  }),
);

const CommentFooter = styled.View(({ theme: { space, colors } }) => ({
  flexDirection: 'row',
  paddingHorizontal: space[4],
  width: '100%',
  borderTopWidth: 1,
  borderTopColor: colors.whiteTransparent[1],
  paddingVertical: space[4],
  minHeight: space[10],
}));

const EditorContainer = styled.ScrollView(({ theme: { space, window } }) => ({
  marginLeft: space[4],
  maxHeight: window.height * 0.2,
  flex: 1,
}));

const EditorWrapper = styled.View(({ theme: { space, colors } }) => ({
  minHeight: space[10],
  backgroundColor: colors.black[2],
  justifyContent: 'center',
}));

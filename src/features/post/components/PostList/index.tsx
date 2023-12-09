import { colors } from '@/theme/colors';
import { WINDOW_HEIGHT } from '@/utils';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { IPost } from '../../types/Post';
import Post from '../Post';
import PostListSkeleton from '../PostListSkeleton';

// const Separator = styled.View(({ theme: { space } }) => ({
//   height: space[5],
// }));

const SkeletonContainer = styled.View(() => ({
  minHeight: WINDOW_HEIGHT,
  flex: 1,
}));
const ListContainer = styled.View(({ theme: { space } }) => ({
  minHeight: WINDOW_HEIGHT - space[14] - space[10] - space[20],
  flex: 1,
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

interface Props {
  data: IPost[];
  onLoadMore: () => void;
  loading?: boolean;
  onDeletePost?: () => void;
  isLoading?: boolean;
  onPostDraft?: (id: string) => void;
}

const PostList = ({
  data,
  onLoadMore,
  loading,
  onDeletePost,
  isLoading,
  onPostDraft,
}: Props) => {
  const { space } = useTheme();
  // const renderSeparator = useCallback(() => <Separator />, []);
  const [isLoaded, setIsLoaded] = useState(false);

  const onFlashListLoaded = useCallback(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);

  const styles = useMemo(() => {
    return {
      paddingTop: space[3],
      paddingBottom: space[6],
    };
  }, [space]);

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);
  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <View
          style={{
            marginVertical: space[2],
          }}>
          <Post
            onDeletePost={onDeletePost}
            postData={item!}
            onPostDraft={onPostDraft}
          />
        </View>
      );
    },
    [onDeletePost, onPostDraft, space],
  );
  const keyExtractor = useCallback(
    (item: IPost, index: number) => item.id.toString() + index,
    [],
  );
  return (
    <>
      {(!isLoaded || isLoading) && (
        <SkeletonContainer>
          <PostListSkeleton />
        </SkeletonContainer>
      )}
      <ListContainer>
        <FlashList
          contentContainerStyle={styles}
          onLayout={onFlashListLoaded}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={renderSeparator}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={120}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={LoadingIcon}
        />
      </ListContainer>
    </>
  );
};

export default React.memo(PostList);
